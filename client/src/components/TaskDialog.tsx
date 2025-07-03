'use client';

import {
	Button,
	CloseButton,
	Dialog,
	Portal,
	createOverlay,
} from '@chakra-ui/react';
import { TaskForm, TaskFormState } from './TaskForm';
import { useTaskContext } from '../contexts/TaskContext';
import { BUTTON_LABELS, DIALOG_LABELS } from '../constants/ui';

interface DialogProps {
	title: string;
	description?: string;
	content?: React.ReactNode;
}

export const NewTaskDialog = createOverlay<DialogProps>((props) => {
	const { title, description, content, ...rest } = props;
	return (
		<Dialog.Root {...rest}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						{title && (
							<Dialog.Header>
								<Dialog.Title>{title}</Dialog.Title>
							</Dialog.Header>
						)}
						<Dialog.Body spaceY="4">
							{description && (
								<Dialog.Description>
									{description}
								</Dialog.Description>
							)}
							{content}
						</Dialog.Body>
						<Dialog.CloseTrigger asChild>
							<CloseButton
								size="sm"
								aria-label={DIALOG_LABELS.CLOSE_DIALOG}
							/>
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
});

export const TaskDialogButton = () => {
	const { createTask } = useTaskContext();

	const handleSubmit = async (form: TaskFormState) => {
		await createTask(form);
		NewTaskDialog.close('a');
	};

	return (
		<>
			<Button
				onClick={() => {
					NewTaskDialog.open('a', {
						title: DIALOG_LABELS.ADD_NEW_TASK,
						content: (
							<TaskForm
								onSubmit={handleSubmit}
								submitLabel={BUTTON_LABELS.ADD_TASK}
							/>
						),
					});
				}}
			>
				{BUTTON_LABELS.ADD_TASK}
			</Button>
			<NewTaskDialog.Viewport />
		</>
	);
};
