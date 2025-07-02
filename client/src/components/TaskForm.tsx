import { TaskStatus, TaskPriority } from '../types/task';
import { formatEnum } from '../utils/format';
import { useForm, Controller } from 'react-hook-form';
import { Field, Input, Textarea, Button } from '@chakra-ui/react';

export interface TaskFormState {
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate: string | null;
}

interface TaskFormProps {
	onSubmit: (form: TaskFormState) => void;
	initialValues?: TaskFormState;
	submitLabel?: string;
	ariaLabel?: string;
	onCancel?: () => void;
}

export const TaskForm = ({
	onSubmit,
	initialValues,
	submitLabel = 'Add Task',
	ariaLabel = 'Task form',
	onCancel,
}: TaskFormProps) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<TaskFormState>({
		defaultValues: initialValues || {
			title: '',
			description: '',
			status: TaskStatus.NOTSTARTED,
			priority: TaskPriority.MEDIUM,
			dueDate: '',
		},
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				onSubmit({
					...data,
					dueDate: data.dueDate ? data.dueDate : null,
				});
			})}
			aria-label={ariaLabel}
			style={{ marginBottom: '20px' }}
		>
			<Field.Root required>
				<Field.Label htmlFor="task-title">
					Task Title <Field.RequiredIndicator />
				</Field.Label>
				<Input
					id="task-title"
					type="text"
					placeholder="Enter task title"
					aria-describedby="title-help"
					{...register('title', {
						required: 'Title is required',
					})}
				/>
				{errors.title && (
					<div style={{ color: 'red' }}>{errors.title.message}</div>
				)}
				<div id="title-help" className="sr-only">
					Enter a descriptive title for your task
				</div>
			</Field.Root>
			<div style={{ marginBottom: '1rem' }}>
				<label htmlFor="task-description">Description</label>
				<Textarea
					id="task-description"
					placeholder="Enter task description"
					rows={3}
					aria-describedby="description-help"
					{...register('description')}
				/>
				<div id="description-help" className="sr-only">
					Provide additional details about the task
				</div>
			</div>

			<Controller
				name="status"
				control={control}
				rules={{ required: 'Status is required' }}
				render={({ field }) => (
					<div style={{ marginBottom: '1rem' }}>
						<label htmlFor="task-status">Status</label>
						<select
							{...field}
							id="task-status"
							aria-describedby="status-help"
							className="styled-select"
						>
							{Object.values(TaskStatus).map((status) => (
								<option key={status} value={status}>
									{formatEnum(status)}
								</option>
							))}
						</select>
						{errors.status && (
							<div style={{ color: 'red' }}>
								{errors.status.message}
							</div>
						)}
						<div id="status-help" className="sr-only">
							Select the current status of the task
						</div>
					</div>
				)}
			/>

			<Controller
				name="priority"
				control={control}
				render={({ field }) => (
					<div style={{ marginBottom: '1rem' }}>
						<label htmlFor="task-priority">Priority</label>
						<select
							{...field}
							id="task-priority"
							aria-describedby="priority-help"
							className="styled-select"
						>
							{Object.values(TaskPriority).map((priority) => (
								<option key={priority} value={priority}>
									{formatEnum(priority)}
								</option>
							))}
						</select>
						{errors.priority && (
							<div style={{ color: 'red' }}>
								{errors.priority.message}
							</div>
						)}
						<div id="priority-help" className="sr-only">
							Select the priority level for the task
						</div>
					</div>
				)}
			/>

			<div style={{ marginBottom: '1rem' }}>
				<label htmlFor="task-due-date">Due Date</label>
				<input
					id="task-due-date"
					type="date"
					aria-describedby="due-date-help"
					{...register('dueDate')}
				/>
				{errors.dueDate && (
					<div style={{ color: 'red' }}>{errors.dueDate.message}</div>
				)}
				<div id="due-date-help" className="sr-only">
					Select the date when the task should be completed
				</div>
			</div>

			<Button type="submit" aria-describedby="submit-help">
				{submitLabel}
			</Button>
			{onCancel && (
				<Button
					type="button"
					onClick={onCancel}
					ml={2}
					variant="outline"
				>
					Cancel
				</Button>
			)}
			<div id="submit-help" className="sr-only">
				Click to save the task
			</div>
		</form>
	);
};
