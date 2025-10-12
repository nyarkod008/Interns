import { Task, CreateTaskRequest } from '../types';
import { networkService } from './NetworkService';

class TaskService {
    private readonly endpoint = '/tasks';

    async getTasks(): Promise<Task[]> {
        try {
            const tasks = await networkService.get<Task[]>(this.endpoint);

            // Convert date strings to Date objects
            return tasks.map(task => ({
                ...task,
                createdAt: new Date(task.createdAt),
            }));
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            throw error;
        }
    }

    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        try {
            const newTask = await networkService.post<Task>(this.endpoint, taskData);

            // Convert date strings to Date objects
            return {
                ...newTask,
                createdAt: new Date(newTask.createdAt),
            };
        } catch (error) {
            console.error('Failed to create task:', error);
            throw error;
        }
    }

    async getTaskById(id: string): Promise<Task> {
        try {
            const task = await networkService.get<Task>(`${this.endpoint}/${id}`);

            // Convert date strings to Date objects
            return {
                ...task,
                createdAt: new Date(task.createdAt),
            };
        } catch (error) {
            console.error('Failed to fetch task:', error);
            throw error;
        }
    }

    async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
        try {
            const updatedTask = await networkService.put<Task>(
                `${this.endpoint}/${id}/status`,
                { status }
            );

            return {
                ...updatedTask,
                createdAt: new Date(updatedTask.createdAt),
            };
        } catch (error) {
            console.error('Failed to update task status:', error);
            throw error;
        }
    }

    // Method to validate task data before submission
    validateTask(task: CreateTaskRequest): string[] {
        const errors: string[] = [];

        if (!task.title || task.title.trim().length === 0) {
            errors.push('Title is required');
        }

        if (task.title && task.title.length > 100) {
            errors.push('Title must be less than 100 characters');
        }

        if (!task.description || task.description.trim().length === 0) {
            errors.push('Description is required');
        }

        if (task.description && task.description.length > 1000) {
            errors.push('Description must be less than 1000 characters');
        }

        if (!task.category || task.category.trim().length === 0) {
            errors.push('Category is required');
        }

        if (!task.requiredSkills || task.requiredSkills.length === 0) {
            errors.push('At least one required skill must be specified');
        }

        return errors;
    }

    // Method to filter tasks by category
    filterTasksByCategory(tasks: Task[], category: string): Task[] {
        return tasks.filter(task =>
            task.category.toLowerCase().includes(category.toLowerCase())
        );
    }

    // Method to filter tasks by skills
    filterTasksBySkills(tasks: Task[], userSkills: string[]): Task[] {
        return tasks.filter(task =>
            task.requiredSkills.some(skill =>
                userSkills.some(userSkill =>
                    userSkill.toLowerCase().includes(skill.toLowerCase())
                )
            )
        );
    }
}

// Export singleton instance
export const taskService = new TaskService();
export default TaskService;