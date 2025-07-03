import React from 'react';
import { TaskStatus, TaskPriority } from '../types/task';
import { Box, Stack, Text, Button } from '@chakra-ui/react';
import {
	FILTER_LABELS,
	BUTTON_LABELS,
	STATUS_DISPLAY,
	PRIORITY_DISPLAY,
	ARIA_LABELS,
} from '../constants/ui';

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
				{FILTER_LABELS.FILTER_TASKS}
			</Text>
			<Stack
				direction={{ base: 'column', md: 'row' }}
				gap={4}
				className="task-filters-controls"
			>
				<div>
					<label htmlFor="status-filter">
						{FILTER_LABELS.STATUS}
					</label>
					<select
						id="status-filter"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						aria-label={ARIA_LABELS.FILTER_BY_STATUS}
						className="styled-select"
					>
						<option value="">{FILTER_LABELS.ALL_STATUSES}</option>
						<option value={TaskStatus.NOTSTARTED}>
							{STATUS_DISPLAY.NOT_STARTED}
						</option>
						<option value={TaskStatus.INPROGRESS}>
							{STATUS_DISPLAY.IN_PROGRESS}
						</option>
						<option value={TaskStatus.COMPLETED}>
							{STATUS_DISPLAY.COMPLETED}
						</option>
					</select>
				</div>
				<div>
					<label htmlFor="priority-filter">
						{FILTER_LABELS.PRIORITY}
					</label>
					<select
						id="priority-filter"
						value={priority}
						onChange={(e) => setPriority(e.target.value)}
						aria-label={ARIA_LABELS.FILTER_BY_PRIORITY}
						className="styled-select"
					>
						<option value="">{FILTER_LABELS.ALL_PRIORITIES}</option>
						<option value={TaskPriority.LOW}>
							{PRIORITY_DISPLAY.LOW}
						</option>
						<option value={TaskPriority.MEDIUM}>
							{PRIORITY_DISPLAY.MEDIUM}
						</option>
						<option value={TaskPriority.HIGH}>
							{PRIORITY_DISPLAY.HIGH}
						</option>
					</select>
				</div>
				{onClear && (
					<Button
						type="button"
						onClick={onClear}
						aria-label={ARIA_LABELS.CLEAR_ALL_FILTERS}
						alignSelf="flex-end"
					>
						{BUTTON_LABELS.CLEAR_FILTERS}
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
