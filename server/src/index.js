// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Debug: Print the database connection info
console.log('API connecting to database:', process.env.DATABASE_URL);

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
	if (err) {
		return console.error('Error acquiring client', err.stack);
	}
	console.log('Successfully connected to PostgreSQL database');
	release();
});

// Basic route
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to TaskFlow API' });
});

// Get all tasks with filtering, search, sorting, and pagination
app.get('/api/tasks', async (req, res) => {
	try {
		const {
			status,
			priority,
			startDate,
			endDate,
			search,
			sortBy,
			sortOrder,
			page: pageParam = 1,
			limit: limitParam = 10,
		} = req.query;

		// Validate and convert pagination parameters
		const page = Math.max(1, parseInt(pageParam) || 1);
		const limit = Math.max(1, Math.min(100, parseInt(limitParam) || 10)); // Cap at 100

		// Base query conditions
		let conditions = [];
		const queryParams = [];
		let paramCount = 1;

		if (search) {
			conditions.push(
				`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`
			);
			queryParams.push(`%${search}%`);
			paramCount++;
		}

		if (status) {
			conditions.push(`status = $${paramCount}`);
			queryParams.push(status);
			paramCount++;
		}

		if (priority) {
			conditions.push(`priority = $${paramCount}`);
			queryParams.push(priority);
			paramCount++;
		}

		if (startDate) {
			conditions.push(`due_date >= $${paramCount}`);
			queryParams.push(startDate);
			paramCount++;
		}

		if (endDate) {
			conditions.push(`due_date <= $${paramCount}`);
			queryParams.push(endDate);
			paramCount++;
		}

		const whereClause =
			conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

		// Get total count
		const countQuery = `SELECT COUNT(*) FROM tasks ${whereClause}`;
		const countResult = await pool.query(countQuery, queryParams);
		const total = parseInt(countResult.rows[0].count);

		// Get paginated results
		let query = `SELECT * FROM tasks ${whereClause}`;

		// Add sorting
		if (sortBy) {
			const validSortFields = [
				'due_date',
				'priority',
				'status',
				'created_at',
			];
			const validSortOrders = ['asc', 'desc'];

			if (validSortFields.includes(sortBy)) {
				const order = validSortOrders.includes(sortOrder?.toLowerCase())
					? sortOrder.toLowerCase()
					: 'asc';
				query += ` ORDER BY ${sortBy} ${order}`;
			} else {
				query += ' ORDER BY created_at DESC';
			}
		} else {
			query += ' ORDER BY created_at DESC';
		}

		// Add pagination
		query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
		queryParams.push(limit, (page - 1) * limit);

		const result = await pool.query(query, queryParams);

		res.json({
			tasks: result.rows,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (err) {
		console.error('Error fetching tasks:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Get a single task by ID
app.get('/api/tasks/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Task not found' });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error('Error fetching task:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
	try {
		const { title, description, due_date, status, priority } = req.body;

		// Build dynamic query based on provided fields
		const fields = [];
		const values = [];
		let paramCount = 1;

		// Always include title (required)
		fields.push('title');
		values.push(title);

		// Add optional fields only if they are provided
		if (description !== undefined) {
			fields.push('description');
			values.push(description);
			paramCount++;
		}

		if (due_date !== undefined) {
			fields.push('due_date');
			values.push(due_date);
			paramCount++;
		}

		if (status !== undefined) {
			fields.push('status');
			values.push(status);
			paramCount++;
		}

		if (priority !== undefined) {
			fields.push('priority');
			values.push(priority);
			paramCount++;
		}

		const query = `
			INSERT INTO tasks (${fields.join(', ')}) 
			VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')}) 
			RETURNING *
		`;

		const result = await pool.query(query, values);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error('Error creating task:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, due_date, status, priority } = req.body;

		// Build dynamic update query based on provided fields
		const updates = [];
		const values = [];
		let paramCount = 1;

		// Add fields to update only if they are provided
		if (title !== undefined) {
			updates.push(`title = $${paramCount}`);
			values.push(title);
			paramCount++;
		}

		if (description !== undefined) {
			updates.push(`description = $${paramCount}`);
			values.push(description);
			paramCount++;
		}

		if (due_date !== undefined) {
			updates.push(`due_date = $${paramCount}`);
			values.push(due_date);
			paramCount++;
		}

		if (status !== undefined) {
			updates.push(`status = $${paramCount}`);
			values.push(status);
			paramCount++;
		}

		if (priority !== undefined) {
			updates.push(`priority = $${paramCount}`);
			values.push(priority);
			paramCount++;
		}

		// Always update the updated_at timestamp
		updates.push(`updated_at = CURRENT_TIMESTAMP`);

		// Add the task ID as the last parameter
		values.push(id);

		const query = `
			UPDATE tasks 
			SET ${updates.join(', ')} 
			WHERE id = $${paramCount} 
			RETURNING *
		`;

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Task not found' });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error('Error updating task:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			'DELETE FROM tasks WHERE id = $1 RETURNING *',
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Task not found' });
		}

		res.json({ message: 'Task deleted successfully' });
	} catch (err) {
		console.error('Error deleting task:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Export the app for testing
module.exports = app;

// Export pool for testing cleanup
module.exports.pool = pool;

// Export function to close pool for testing
module.exports.closePool = async () => {
	if (pool) {
		await pool.end();
	}
};

// Start server only if this file is run directly
if (require.main === module) {
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
}
