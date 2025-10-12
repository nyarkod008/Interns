import { NavigationContainerRef } from '@react-navigation/native';
import { RootTabParamList, Task } from '../types';

// Navigation utilities for use outside of React components
export class NavigationUtils {
    private static navigationRef: NavigationContainerRef<RootTabParamList> | null = null;

    static setNavigationRef(ref: NavigationContainerRef<RootTabParamList>) {
        NavigationUtils.navigationRef = ref;
    }

    static navigate(name: keyof RootTabParamList, params?: any) {
        if (NavigationUtils.navigationRef?.isReady()) {
            NavigationUtils.navigationRef.navigate(name, params);
        }
    }

    static goBack() {
        if (NavigationUtils.navigationRef?.isReady() && NavigationUtils.navigationRef.canGoBack()) {
            NavigationUtils.navigationRef.goBack();
        }
    }

    static reset(routeName: keyof RootTabParamList) {
        if (NavigationUtils.navigationRef?.isReady()) {
            NavigationUtils.navigationRef.reset({
                index: 0,
                routes: [{ name: routeName }],
            });
        }
    }

    // Specific navigation methods
    static navigateToHome() {
        NavigationUtils.navigate('Home');
    }

    static navigateToProfile() {
        NavigationUtils.navigate('Profile');
    }

    static navigateToTaskFeed() {
        NavigationUtils.navigate('TaskFeed');
    }

    static navigateToTaskForm() {
        NavigationUtils.navigate('TaskForm');
    }

    static navigateToTaskDetail(task: Task) {
        // For now, navigate to TaskFeed
        // In a full implementation, this would navigate to a TaskDetail screen
        console.log('Navigating to task detail:', task.title);
        NavigationUtils.navigate('TaskFeed');
    }
}

// Helper function to get current route name
export const getCurrentRouteName = (
    navigationRef: NavigationContainerRef<RootTabParamList>
): string | undefined => {
    if (navigationRef.isReady()) {
        return navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
};

// Helper function to check if we can go back
export const canGoBack = (
    navigationRef: NavigationContainerRef<RootTabParamList>
): boolean => {
    if (navigationRef.isReady()) {
        return navigationRef.canGoBack();
    }
    return false;
};