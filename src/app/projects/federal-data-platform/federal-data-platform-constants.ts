export const SELECTION_VALIDATION_DIAGRAM = `flowchart TD
    A[User changes selection] --> B[Validate current selection against parsed data]
    B -->|Valid| C[View is updated with filtered data]
    B -->|Invalid| D[Compute fallback selection]
    D --> E[Update application state]
    E --> C`;
