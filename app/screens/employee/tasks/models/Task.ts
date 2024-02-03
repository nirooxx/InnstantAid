// models/Task.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string; // ISO string format
    status: 'new' | 'in progress' | 'completed';
    assignedTo: string;
    roleRequired: string;
    notes?: string[];
  }
  