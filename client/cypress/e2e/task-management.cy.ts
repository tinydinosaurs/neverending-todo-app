describe('Task Management E2E', () => {
	beforeEach(() => {
		// Start the development server and visit the app
		cy.visit('http://localhost:3000');
	});

	it('should display the main page with header and filters', () => {
		// Check main page elements
		cy.get('h1').contains('TaskFlow').should('be.visible');
		cy.get('button').contains('Add Task').should('be.visible');
		cy.get('legend').contains('Filter Tasks').should('be.visible');
		cy.get('h2').contains('My Tasks').should('be.visible');
	});

	it('should show empty state when no tasks exist', () => {
		// Should show empty state message
		cy.contains(
			'No tasks found. Create your first task to get started!'
		).should('be.visible');
	});

	it('should open add task dialog when Add Task button is clicked', () => {
		cy.get('button').contains('Add Task').click();

		// Dialog should be visible
		cy.get('[role="dialog"]').should('be.visible');
		cy.get('[role="dialog"] h2')
			.contains('Add a new task')
			.should('be.visible');

		// Form fields should be present
		cy.get('#task-title').should('be.visible');
		cy.get('#task-description').should('be.visible');
		cy.get('#task-status').should('be.visible');
		cy.get('#task-priority').should('be.visible');
		cy.get('#task-due-date').should('be.visible');
	});

	it('should close dialog when cancel button is clicked', () => {
		cy.get('button').contains('Add Task').click();
		cy.get('[role="dialog"]').should('be.visible');

		cy.get('button').contains('Cancel').click();
		cy.get('[role="dialog"]').should('not.exist');
	});

	it('should close dialog when close button is clicked', () => {
		cy.get('button').contains('Add Task').click();
		cy.get('[role="dialog"]').should('be.visible');

		cy.get('[role="dialog"] button[aria-label="Close dialog"]').click();
		cy.get('[role="dialog"]').should('not.exist');
	});

	it('should show validation error for empty required fields', () => {
		cy.get('button').contains('Add Task').click();
		cy.get('button[type="submit"]').click();

		// Should show validation error
		cy.contains('Title is required').should('be.visible');
	});

	it('should filter tasks by status', () => {
		// Select a status filter
		cy.get('#status-filter').select('NOTSTARTED');

		// Should show filter status announcement
		cy.get('.sr-only[aria-live="polite"]').should(
			'contain',
			'Filters applied'
		);
	});

	it('should filter tasks by priority', () => {
		// Select a priority filter
		cy.get('#priority-filter').select('HIGH');

		// Should show filter status announcement
		cy.get('.sr-only[aria-live="polite"]').should(
			'contain',
			'Filters applied'
		);
	});

	it('should clear filters when clear button is clicked', () => {
		// Set some filters first
		cy.get('#status-filter').select('NOTSTARTED');
		cy.get('#priority-filter').select('HIGH');

		// Clear filters
		cy.get('button').contains('Clear Filters').click();

		// Should show no filters applied
		cy.get('.sr-only[aria-live="polite"]').should(
			'contain',
			'No filters applied'
		);
	});

	it('should have proper keyboard navigation', () => {
		// Test skip link
		cy.get('.skip-link').should('exist');

		// Test tab navigation using keyboard
		cy.get('body').type('{tab}');
		cy.focused().should('have.attr', 'href', '#main-content');

		// Tab to main content
		cy.get('body').type('{tab}');
		cy.focused().should('have.id', 'main-content');
	});

	it('should have proper accessibility attributes', () => {
		// Check main landmarks
		cy.get('[role="banner"]').should('exist');
		cy.get('[role="main"]').should('exist');

		// Check form accessibility
		cy.get('fieldset').should('exist');
		cy.get('legend').should('exist');

		// Check button accessibility
		cy.get('button')
			.contains('Add Task')
			.should('have.attr', 'type', 'button');
	});
});
