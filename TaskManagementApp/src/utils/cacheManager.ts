import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, UserProfile } from '../types';

export class CacheManager {
    private static instance: CacheManager;
    private readonly CACHE_KEYS = {
        TASKS: 'cached_tasks',
        PROFILE: 'cached_profile',
        LAST_SYNC: 'last_sync_timestamp',
    };

    private constructor() { }

    static getInstance(): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    // Cache tasks data
    async cacheTasks(tasks: Task[]): Promise<void> {
        try {
            const cacheData = {
                tasks,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(
                this.CACHE_KEYS.TASKS,
                JSON.stringify(cacheData)
            );
            console.log('Tasks cached successfully');
        } catch (error) {
            console.error('Failed to cache tasks:', error);
        }
    }

    // Get cached tasks
    async getCachedTasks(): Promise<Task[] | null> {
        try {
            const cachedData = await AsyncStorage.getItem(this.CACHE_KEYS.TASKS);
            if (!cachedData) {
                return null;
            }

            const { tasks, timestamp } = JSON.parse(cachedData);

            // Check if cache is still valid (24 hours)
            const cacheAge = Date.now() - timestamp;
            const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            if (cacheAge > maxCacheAge) {
                console.log('Cached tasks expired');
                await this.clearTasksCache();
                return null;
            }

            // Convert date strings back to Date objects
            const tasksWithDates = tasks.map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt),
            }));

            return tasksWithDates;
        } catch (error) {
            console.error('Failed to get cached tasks:', error);
            return null;
        }
    }

    // Cache profile data
    async cacheProfile(profile: UserProfile): Promise<void> {
        try {
            const cacheData = {
                profile,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(
                this.CACHE_KEYS.PROFILE,
                JSON.stringify(cacheData)
            );
            console.log('Profile cached successfully');
        } catch (error) {
            console.error('Failed to cache profile:', error);
        }
    }

    // Get cached profile
    async getCachedProfile(): Promise<UserProfile | null> {
        try {
            const cachedData = await AsyncStorage.getItem(this.CACHE_KEYS.PROFILE);
            if (!cachedData) {
                return null;
            }

            const { profile, timestamp } = JSON.parse(cachedData);

            // Check if cache is still valid (1 hour)
            const cacheAge = Date.now() - timestamp;
            const maxCacheAge = 60 * 60 * 1000; // 1 hour in milliseconds

            if (cacheAge > maxCacheAge) {
                console.log('Cached profile expired');
                await this.clearProfileCache();
                return null;
            }

            // Convert date strings back to Date objects
            const profileWithDates = {
                ...profile,
                createdAt: new Date(profile.createdAt),
                updatedAt: new Date(profile.updatedAt),
            };

            return profileWithDates;
        } catch (error) {
            console.error('Failed to get cached profile:', error);
            return null;
        }
    }

    // Clear tasks cache
    async clearTasksCache(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.CACHE_KEYS.TASKS);
            console.log('Tasks cache cleared');
        } catch (error) {
            console.error('Failed to clear tasks cache:', error);
        }
    }

    // Clear profile cache
    async clearProfileCache(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.CACHE_KEYS.PROFILE);
            console.log('Profile cache cleared');
        } catch (error) {
            console.error('Failed to clear profile cache:', error);
        }
    }

    // Clear all cache
    async clearAllCache(): Promise<void> {
        try {
            await Promise.all([
                this.clearTasksCache(),
                this.clearProfileCache(),
                AsyncStorage.removeItem(this.CACHE_KEYS.LAST_SYNC),
            ]);
            console.log('All cache cleared');
        } catch (error) {
            console.error('Failed to clear all cache:', error);
        }
    }

    // Update last sync timestamp
    async updateLastSync(): Promise<void> {
        try {
            await AsyncStorage.setItem(
                this.CACHE_KEYS.LAST_SYNC,
                Date.now().toString()
            );
        } catch (error) {
            console.error('Failed to update last sync:', error);
        }
    }

    // Get last sync timestamp
    async getLastSync(): Promise<number | null> {
        try {
            const timestamp = await AsyncStorage.getItem(this.CACHE_KEYS.LAST_SYNC);
            return timestamp ? parseInt(timestamp, 10) : null;
        } catch (error) {
            console.error('Failed to get last sync:', error);
            return null;
        }
    }

    // Check if data should be synced (based on last sync time)
    async shouldSync(maxAge: number = 5 * 60 * 1000): Promise<boolean> {
        const lastSync = await this.getLastSync();
        if (!lastSync) {
            return true;
        }

        const age = Date.now() - lastSync;
        return age > maxAge;
    }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();