// Simple HTTP-based Supabase service for React Native compatibility
import { UserProfile, Task, CreateTaskRequest } from '../types';

class SupabaseHttpService {
    private readonly baseUrl = 'https://nftdpjmnsapszkebvdwl.supabase.co/rest/v1';
    private readonly apiKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key

    private async makeRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
        body?: any
    ): Promise<T> {
        const headers: Record<string, string> = {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        };

        const config: RequestInit = {
            method,
            headers,
        };

        if (body && method !== 'GET') {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw {
                message: `Supabase API error: ${response.status}`,
                code: `SUPABASE_${response.status}`,
                details: errorText,
            };
        }

        return response.json();
    }

    // Profile methods
    async getProfile(userId: string = 'default-user'): Promise<UserProfile> {
        try {
            const profiles = await this.makeRequest<any[]>(`/profiles?id=eq.${userId}`);

            if (profiles.length === 0) {
                return this.createDefaultProfile(userId);
            }

            const profile = profiles[0];
            return {
                id: profile.id,
                name: profile.name,
                bio: profile.bio,
                skills: profile.skills,
                location: profile.location,
                createdAt: new Date(profile.created_at),
                updatedAt: new Date(profile.updated_at),
            };
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            throw {
                message: 'Failed to load profile',
                code: 'SUPABASE_ERROR',
                details: error,
            };
        }
    }

    async updateProfile(profileData: Partial<UserProfile>, userId: string = 'default-user'): Promise<UserProfile> {
        try {
            const updateData = {
                id: userId,
                name: profileData.name,
                bio: profileData.bio,
                skills: profileData.skills,
                location: profileData.location,
                updated_at: new Date().toISOString(),
            };

            const profiles = await this.makeRequest<any[]>(`/profiles?id=eq.${userId}`, 'PATCH', updateData);

            if (profiles.length === 0) {
                // Profile doesn't exist, create it
                const newProfiles = await this.makeRequest<any[]>('/profiles', 'POST', {
                    ...updateData,
                    created_at: new Date().toISOString(),
                });
                const profile = newProfiles[0];
                return {
                    id: profile.id,
                    name: profile.name,
                    bio: profile.bio,
                    skills: profile.skills,
                    location: profile.location,
                    createdAt: new Date(profile.created_at),
                    updatedAt: new Date(profile.updated_at),
                };
            }

            const profile = profiles[0];
            return {
                id: profile.id,
                name: profile.name,
                bio: profile.bio,
                skills: profile.skills,
                location: profile.location,
                createdAt: new Date(profile.created_at),
                updatedAt: new Date(profile.updated_at),
            };
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw {
                message: 'Failed to update profile',
                code: 'SUPABASE_ERROR',
                details: error,
            };
        }
    }

    private async createDefaultProfile(userId: string): Promise<UserProfile> {
        const defaultProfile = {
            id: userId,
            name: 'New User',
            bio: 'Tell us about yourself...',
            skills: ['Add your skills'],
            location: 'Your location',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const profiles = await this.makeRequest<any[]>('/profiles', 'POST', defaultProfile);
        const profile = profiles[0];

        return {
            id: profile.id,
            name: profile.name,
            bio: profile.bio,
            skills: profile.skills,
            location: profile.location,
            createdAt: new Date(profile.created_at),
            updatedAt: new Date(profile.updated_at),
        };
    }

    // Task methods
    async getTasks(): Promise<Task[]> {
        try {
            const tasks = await this.makeRequest<any[]>('/tasks?order=created_at.desc');

            return tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                category: task.category,
                requiredSkills: task.required_skills,
                createdBy: task.created_by,
                createdByName: task.created_by_name,
                createdAt: new Date(task.created_at),
                status: task.status,
            }));
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            throw {
                message: 'Failed to load tasks',
                code: 'SUPABASE_ERROR',
                details: error,
            };
        }
    }

    async createTask(taskData: CreateTaskRequest, userId: string = 'default-user', userName: string = 'Anonymous'): Promise<Task> {
        try {
            const newTask = {
                title: taskData.title,
                description: taskData.description,
                category: taskData.category,
                required_skills: taskData.requiredSkills,
                created_by: userId,
                created_by_name: userName,
                status: 'open',
                created_at: new Date().toISOString(),
            };

            const tasks = await this.makeRequest<any[]>('/tasks', 'POST', newTask);
            const task = tasks[0];

            return {
                id: task.id,
                title: task.title,
                description: task.description,
                category: task.category,
                requiredSkills: task.required_skills,
                createdBy: task.created_by,
                createdByName: task.created_by_name,
                createdAt: new Date(task.created_at),
                status: task.status,
            };
        } catch (error) {
            console.error('Failed to create task:', error);
            throw {
                message: 'Failed to create task',
                code: 'SUPABASE_ERROR',
                details: error,
            };
        }
    }

    async getTaskById(id: string): Promise<Task> {
        try {
            const tasks = await this.makeRequest<any[]>(`/tasks?id=eq.${id}`);

            if (tasks.length === 0) {
                throw new Error('Task not found');
            }

            const task = tasks[0];
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                category: task.category,
                requiredSkills: task.required_skills,
                createdBy: task.created_by,
                createdByName: task.created_by_name,
                createdAt: new Date(task.created_at),
                status: task.status,
            };
        } catch (error) {
            console.error('Failed to fetch task:', error);
            throw {
                message: 'Failed to load task',
                code: 'SUPABASE_ERROR',
                details: error,
            };
        }
    }

    // Validation methods (same as other services)
    validateProfile(profile: Partial<UserProfile>): string[] {
        const errors: string[] = [];

        if (!profile.name || profile.name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (profile.name && profile.name.length > 100) {
            errors.push('Name must be less than 100 characters');
        }

        if (profile.bio && profile.bio.length > 500) {
            errors.push('Bio must be less than 500 characters');
        }

        if (!profile.location || profile.location.trim().length === 0) {
            errors.push('Location is required');
        }

        if (!profile.skills || profile.skills.length === 0) {
            errors.push('At least one skill is required');
        }

        return errors;
    }

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
}

// Export singleton instance
export const supabaseHttpService = new SupabaseHttpService();
export default SupabaseHttpService;