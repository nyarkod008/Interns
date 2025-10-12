import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootTabParamList, Task } from '../types';

// Tab navigation types
export type TabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

// Screen-specific navigation props
export type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;
export type ProfileScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Profile'>;
export type TaskFeedScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'TaskFeed'>;
export type TaskFormScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'TaskForm'>;

// Route props
export type HomeScreenRouteProp = RouteProp<RootTabParamList, 'Home'>;
export type ProfileScreenRouteProp = RouteProp<RootTabParamList, 'Profile'>;
export type TaskFeedScreenRouteProp = RouteProp<RootTabParamList, 'TaskFeed'>;
export type TaskFormScreenRouteProp = RouteProp<RootTabParamList, 'TaskForm'>;

// Combined props for screens
export type HomeScreenProps = {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
};

export type ProfileScreenProps = {
    navigation: ProfileScreenNavigationProp;
    route: ProfileScreenRouteProp;
};

export type TaskFeedScreenProps = {
    navigation: TaskFeedScreenNavigationProp;
    route: TaskFeedScreenRouteProp;
};

export type TaskFormScreenProps = {
    navigation: TaskFormScreenNavigationProp;
    route: TaskFormScreenRouteProp;
};

// Navigation actions
export interface NavigationActions {
    navigateToHome: () => void;
    navigateToProfile: () => void;
    navigateToTaskFeed: () => void;
    navigateToTaskForm: () => void;
    navigateToTaskDetail: (task: Task) => void;
    goBack: () => void;
}