// Service configuration - switch between mock and Supabase services
import { profileService as mockProfileService } from './ProfileService';
import { taskService as mockTaskService } from './TaskService';
import { supabaseHttpService } from './SupabaseHttpService';

// Configuration flag - set to true to use Supabase, false for mock data
const USE_SUPABASE = false; // Change to true when you want to use Supabase

// Create service adapters for Supabase HTTP service
const supabaseProfileAdapter = {
    getProfile: () => supabaseHttpService.getProfile(),
    updateProfile: (profile: any) => supabaseHttpService.updateProfile(profile),
    validateProfile: (profile: any) => supabaseHttpService.validateProfile(profile),
};

const supabaseTaskAdapter = {
    getTasks: () => supabaseHttpService.getTasks(),
    createTask: (task: any) => supabaseHttpService.createTask(task),
    getTaskById: (id: string) => supabaseHttpService.getTaskById(id),
    validateTask: (task: any) => supabaseHttpService.validateTask(task),
    filterTasksByCategory: (tasks: any[], category: string) =>
        tasks.filter(task => task.category.toLowerCase().includes(category.toLowerCase())),
    filterTasksBySkills: (tasks: any[], userSkills: string[]) =>
        tasks.filter(task =>
            task.requiredSkills.some((skill: string) =>
                userSkills.some(userSkill =>
                    userSkill.toLowerCase().includes(skill.toLowerCase())
                )
            )
        ),
};

// Export the appropriate services based on configuration
export const profileService = USE_SUPABASE ? supabaseProfileAdapter : mockProfileService;
export const taskService = USE_SUPABASE ? supabaseTaskAdapter : mockTaskService;

// Export individual services for direct access if needed
export { mockProfileService, mockTaskService, supabaseHttpService };

// Export service types
export type ProfileServiceType = typeof profileService;
export type TaskServiceType = typeof taskService;