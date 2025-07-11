import { TaskList } from './components/TaskList';
import { TaskProvider } from './contexts/TaskContext';
import { Toast } from './components/Toast';
import { useTaskContext } from './contexts/TaskContext';
import { Heading, Flex } from '@chakra-ui/react';
import { TaskDialogButton } from './components/TaskDialog';
import { NewTaskDialog } from './components/TaskDialog';
import { Container } from '@chakra-ui/react';
import './App.css';

function AppContent() {
	const { toast, clearToast } = useTaskContext();
	return (
		<Container maxW="6xl" px={4}>
			<div className="App">
				{/* Skip link for keyboard users */}
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				<Flex
					as="header"
					role="banner"
					alignItems="center"
					justifyContent="space-between"
					mb={8}
					px={4}
					py={6}
				>
					<Heading size="4xl" as="h1">
						TaskFlow
					</Heading>
					<TaskDialogButton />
				</Flex>
				<main id="main-content" role="main" tabIndex={-1}>
					<TaskList />
				</main>
				{toast && <Toast message={toast} onClose={clearToast} />}
				<NewTaskDialog.Viewport />
			</div>
		</Container>
	);
}

function App() {
	return (
		<TaskProvider>
			<AppContent />
		</TaskProvider>
	);
}

export default App;
export { AppContent };
