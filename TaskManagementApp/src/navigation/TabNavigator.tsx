import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TaskFeedScreen from '../screens/TaskFeedScreen';
import TaskFormScreen from '../screens/TaskFormScreen';

// Import types
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        case 'TaskFeed':
                            iconName = focused ? 'list' : 'list-outline';
                            break;
                        case 'TaskForm':
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E5EA',
                },
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#333',
                },
                headerTintColor: '#007AFF',
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Home',
                    headerTitle: 'Task Management',
                }}
            />
            <Tab.Screen
                name="TaskFeed"
                component={TaskFeedScreen}
                options={{
                    title: 'Tasks',
                    headerTitle: 'Browse Tasks',
                }}
            />
            <Tab.Screen
                name="TaskForm"
                component={TaskFormScreen}
                options={{
                    title: 'Create',
                    headerTitle: 'Create Task',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerTitle: 'My Profile',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;