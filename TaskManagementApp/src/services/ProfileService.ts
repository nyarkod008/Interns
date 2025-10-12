import { UserProfile } from '../types';
import { networkService } from './NetworkService';

class ProfileService {
    private readonly endpoint = '/profile';

    async getProfile(): Promise<UserProfile> {
        try {
            const profile = await networkService.get<UserProfile>(this.endpoint);

            // Convert date strings to Date objects
            return {
                ...profile,
                createdAt: new Date(profile.createdAt),
                updatedAt: new Date(profile.updatedAt),
            };
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            throw error;
        }
    }

    async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
        try {
            // Remove dates and id from update payload
            const { id, createdAt, updatedAt, ...updateData } = profile;

            const updatedProfile = await networkService.put<UserProfile>(
                this.endpoint,
                updateData
            );

            // Convert date strings to Date objects
            return {
                ...updatedProfile,
                createdAt: new Date(updatedProfile.createdAt),
                updatedAt: new Date(updatedProfile.updatedAt),
            };
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }

    // Method to validate profile data before submission
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
}

// Export singleton instance
export const profileService = new ProfileService();
export default ProfileService;