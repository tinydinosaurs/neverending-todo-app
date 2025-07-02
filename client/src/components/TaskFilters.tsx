import React from 'react';
import { TaskStatus, TaskPriority } from '../types/task';
import { Box, Stack, Text, Button } from '@chakra-ui/react';

interface TaskFiltersProps {
	status: string;
	setStatus: (value: string) => void;
	priority: string;
	setPriority: (value: string) => void;
	onClear?: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
	status,
	setStatus,
	priority,
	setPriority,
	onClear,
}) => {
	return (
		<Box
			className="task-filter-group"
			as="fieldset"
			borderWidth="1px"
			borderRadius="md"
			borderColor="gray.200"
			p={4}
			mb={4}
		>
			<Text as="legend" textAlign="left" fontWeight="bold" mb={2}>
				Filter Tasks
			</Text>
			<Stack
				direction={{ base: 'column', md: 'row' }}
				gap={4}
				className="task-filters-controls"
			>
				<div>
					<label htmlFor="status-filter">Status:</label>
					<select
						id="status-filter"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						aria-label="Filter by task status"
						className="styled-select"
					>
						<option value="">All Statuses</option>
						<option value={TaskStatus.NOTSTARTED}>
							Not Started
						</option>
						<option value={TaskStatus.INPROGRESS}>
							In Progress
						</option>
						<option value={TaskStatus.COMPLETED}>Completed</option>
					</select>
				</div>
				<div>
					<label htmlFor="priority-filter">Priority:</label>
					<select
						id="priority-filter"
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
						aria-label="Filter by task priority"
						className="styled-select"
					>
						<option value="">All Priorities</option>
						<option value={TaskPriority.LOW}>Low</option>
						<option value={TaskPriority.MEDIUM}>Medium</option>
						<option value={TaskPriority.HIGH}>High</option>
					</select>
				</div>
				{onClear && (
					<Button
						type="button"
						onClick={onClear}
						aria-label="Clear all filters"
						alignSelf="flex-end"
					>
						Clear Filters
					</Button>
				)}
			</Stack>
			<div className="sr-only" aria-live="polite">
				{status || priority
					? `Filters applied: ${status ? `Status: ${status}` : ''} ${
							priority ? `Priority: ${priority}` : ''
					  }`.trim()
					: 'No filters applied'}
			</div>
		</Box>
	);
};
