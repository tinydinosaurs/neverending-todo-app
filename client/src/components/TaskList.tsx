import React from 'react';
import { TaskFilters } from './TaskFilters';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useTaskContext } from '../contexts/TaskContext';
import { Heading, SimpleGrid } from '@chakra-ui/react';

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
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} p={4}>
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onDelete={deleteTask}
						onUpdate={updateTask}
					/>
				))}
			</SimpleGrid>
		</div>
	);
};
