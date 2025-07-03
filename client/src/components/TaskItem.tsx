import React, { useMemo, useCallback } from 'react';
import { Task } from '../types/task';
import { TaskForm } from './TaskForm';
import { TaskFormState } from './TaskForm';
import { TaskStatus, TaskPriority } from '../types/task';
import { formatEnum } from '../utils/format';
import {
	BUTTON_LABELS,
	DIALOG_LABELS,
	ARIA_LABELS,
	MESSAGES,
} from '../constants/ui';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Heading,
	Text,
	Stack,
} from '@chakra-ui/react';
import { NewTaskDialog } from './TaskDialog';

interface TaskItemProps {
	task: Task;
	onDelete: (id: number) => void;
	onUpdate: (id: number, form: TaskFormState) => void;
}

export const TaskItem = React.memo(
	({ task, onDelete, onUpdate }: TaskItemProps) => {
		// Memoize expensive date formatting
		const formattedDueDate = useMemo(() => {
			if (!task.due_date) return 'None';
			return new Date(task.due_date).toLocaleDateString();
		}, [task.due_date]);

		// Memoize form initial values to prevent unnecessary re-renders
		const formInitialValues = useMemo(
			() => ({
				title: task.title,
				description: task.description,
				status: task.status as TaskStatus,
				priority: task.priority as TaskPriority,
				dueDate: (task.due_date || '').slice(0, 10),
			}),
			[
				task.title,
				task.description,
				task.status,
				task.priority,
				task.due_date,
			]
		);

		const handleEdit = useCallback(() => {
			NewTaskDialog.open(`edit-task-${task.id}`, {
				title: DIALOG_LABELS.EDIT_TASK,
				description: `Edit the details for "${task.title}"`,
				content: (
					<TaskForm
						initialValues={formInitialValues}
						onSubmit={async (form) => {
							onUpdate(task.id, form);
							NewTaskDialog.close(`edit-task-${task.id}`);
						}}
						submitLabel={BUTTON_LABELS.SAVE_CHANGES}
						ariaLabel={`${ARIA_LABELS.EDIT_TASK} ${task.title}`}
						onCancel={() =>
							NewTaskDialog.close(`edit-task-${task.id}`)
						}
					/>
				),
			});
		}, [formInitialValues, onUpdate, task.id, task.title]);

		const handleDelete = useCallback(() => {
			onDelete(task.id);
		}, [onDelete, task.id]);

		// Keyboard navigation for delete confirmation
		const handleDeleteKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					if (
						window.confirm(
							`${MESSAGES.DELETE_CONFIRMATION} "${task.title}"?`
						)
					) {
						onDelete(task.id);
					}
				}
			},
			[onDelete, task.id, task.title]
		);

		return (
			<Card.Root
				className="task-card"
				aria-labelledby={`task-title-${task.id}`}
				p={4}
				mb={4}
			>
				<CardHeader pb={2}>
					<Heading as="h3" size="md" id={`task-title-${task.id}`}>
						{task.title}
					</Heading>
				</CardHeader>
				<CardBody pt={0}>
					<Text
						mb={2}
						aria-describedby={`task-description-${task.id}`}
					>
						{task.description}
					</Text>
					<Stack as="dl" mb={2}>
						<Stack direction="row" as="div">
							<Text as="dt" fontWeight="bold" minW="70px">
								Status:
							</Text>
							<Text
								as="dd"
								aria-label={`Task status is ${task.status}`}
							>
								{formatEnum(task.status)}
							</Text>
						</Stack>
						<Stack direction="row" as="div">
							<Text as="dt" fontWeight="bold" minW="70px">
								Priority:
							</Text>
							<Text
								as="dd"
								aria-label={`Task priority is ${task.priority}`}
							>
								{formatEnum(task.priority)}
							</Text>
						</Stack>
						<Stack direction="row" as="div">
							<Text as="dt" fontWeight="bold" minW="70px">
								Due Date:
							</Text>
							<Text
								as="dd"
								aria-label={`Task is due on ${formattedDueDate}`}
							>
								{formattedDueDate}
							</Text>
						</Stack>
					</Stack>
				</CardBody>
				<CardFooter pt={2} display="flex" gap={2}>
					<Button
						onClick={handleEdit}
						type="button"
						aria-label={`${ARIA_LABELS.EDIT_TASK} ${task.title}`}
						colorScheme="blue"
					>
						{BUTTON_LABELS.EDIT}
					</Button>
					<Button
						onClick={handleDelete}
						onKeyDown={handleDeleteKeyDown}
						type="button"
						aria-label={`${ARIA_LABELS.DELETE_TASK} ${task.title}`}
						colorScheme="red"
					>
						{BUTTON_LABELS.DELETE}
					</Button>
				</CardFooter>
			</Card.Root>
		);
	}
);

TaskItem.displayName = 'TaskItem';
