import React from 'react';
import { TaskFilters } from './TaskFilters';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useTaskContext } from '../contexts/TaskContext';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { MESSAGES } from '../constants/ui';

export const TaskList = () => {
	const {
		tasks,
		loading,
		error,
		statusFilter,
		setStatusFilter,
		priorityFilter,
		setPriorityFilter,
		deleteTask,
		updateTask,
		clearFilters,
		refreshTasks,
	} = useTaskContext();

	if (loading) return <LoadingSpinner />;
	if (error) return <ErrorMessage message={error} onRetry={refreshTasks} />;

	return (
		<div>
			<div className="task-filters">
				<TaskFilters
					status={statusFilter}
					setStatus={setStatusFilter}
					priority={priorityFilter}
					setPriority={setPriorityFilter}
					onClear={clearFilters}
				/>
			</div>
			<Heading as="h2" size="lg" mb={4}>
				My Tasks ({tasks.length})
			</Heading>
			{tasks.length === 0 ? (
				<div
					role="status"
					aria-live="polite"
					className="empty-state"
					style={{ textAlign: 'center', padding: '2rem' }}
				>
					<p>{MESSAGES.NO_TASKS}</p>
				</div>
			) : (
				<SimpleGrid
					columns={{ base: 1, md: 2 }}
					gap={4}
					p={4}
					as="ul"
					listStyleType="none"
					role="list"
					aria-label={`Task list with ${tasks.length} tasks`}
				>
					{tasks.map((task) => (
						<li key={task.id}>
							<TaskItem
								task={task}
								onDelete={deleteTask}
								onUpdate={updateTask}
							/>
						</li>
					))}
				</SimpleGrid>
			)}
		</div>
	);
};
