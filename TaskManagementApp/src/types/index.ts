// Core type definitions for the Task Management App

export interface UserProfile {
    id: string;
    name: string;
    bio: string;
    skills: string[];
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    status: 'open' | 'in_progress' | 'completed';
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface ApiError {
    message: string;
    code: string;
    details?: any;
}

// Navigation types
export type RootTabParamList = {
    Home: undefined;
    Profile: undefined;
    TaskFeed: undefined;
    TaskForm: undefined;
};

export type TaskDetailParams = {
    task: Task;
};