import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { TabNavigationProp, NavigationActions } from '../navigation/navigationTypes';
import { Task } from '../types';

export const useAppNavigation = (): NavigationActions => {
    const navigation = useRNNavigation<TabNavigationProp>();

    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    const navigateToProfile = () => {
        navigation.navigate('Profile');
    };

    const navigateToTaskFeed = () => {
        navigation.navigate('TaskFeed');
    };

    const navigateToTaskForm = () => {
        navigation.navigate('TaskForm');
    };

    const navigateToTaskDetail = (task: Task) => {
        // For now, we'll just navigate to TaskFeed
        // In a full implementation, this would navigate to a TaskDetail screen
        console.log('Navigating to task detail:', task.title);
        navigation.navigate('TaskFeed');
    };

    const goBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return {
        navigateToHome,
        navigateToProfile,
        navigateToTaskFeed,
        navigateToTaskForm,
        navigateToTaskDetail,
        goBack,
    };
};