export interface Task {
    id: string;
    title: string;
    assignmentDate: string;
    dueDate: string;
    status: 'assigned' | 'review' | 'aprroved';
};