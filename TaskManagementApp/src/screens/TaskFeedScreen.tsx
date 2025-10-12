import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskCard, LoadingButton } from '../components';
import { Task } from '../types';
import { taskService } from '../services';
import { useAppNavigation } from '../hooks';

const TaskFeedScreen: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const navigation = useAppNavigation();

    // Load tasks on component mount
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setIsLoading(true);
            }
            setLoadError(null);

            const fetchedTasks = await taskService.getTasks();
            setTasks(fetchedTasks);

        } catch (error: any) {
            console.error('Failed to load tasks:', error);
            setLoadError(error.message || 'Failed to load tasks');

            // Show mock data for development
            const mockTasks: Task[] = [
                {
                    id: '1',
                    title: 'React Native Mobile App Development',
                    description: 'Looking for an experienced React Native developer to build a cross-platform mobile application with modern UI/UX design.',
                    category: 'Development',
                    requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile UI/UX'],
                    createdBy: 'user1',
                    createdByName: 'Sarah Johnson',
                    createdAt: new Date('2024-01-15'),
                    status: 'open',
                },
                {
                    id: '2',
                    title: 'Logo Design for Tech Startup',
                    description: 'Need a creative logo designer to create a modern, professional logo for our new tech startup. Should reflect innovation and reliability.',
                    category: 'Design',
                    requiredSkills: ['Graphic Design', 'Logo Design', 'Adobe Illustrator', 'Branding'],
                    createdBy: 'user2',
                    createdByName: 'Mike Chen',
                    createdAt: new Date('2024-01-14'),
                    status: 'open',
                },
                {
                    id: '3',
                    title: 'Content Writing for Blog',
                    description: 'Seeking a skilled content writer to create engaging blog posts about technology trends and software development.',
                    category: 'Writing',
                    requiredSkills: ['Content Writing', 'SEO', 'Technology Writing', 'Research'],
                    createdBy: 'user3',
                    createdByName: 'Emily Davis',
                    createdAt: new Date('2024-01-13'),
                    status: 'in_progress',
                },
                {
                    id: '4',
                    title: 'Social Media Marketing Campaign',
                    description: 'Looking for a social media expert to develop and execute a comprehensive marketing campaign across multiple platforms.',
                    category: 'Marketing',
                    requiredSkills: ['Social Media Marketing', 'Content Strategy', 'Analytics', 'Campaign Management'],
                    createdBy: 'user4',
                    createdByName: 'David Wilson',
                    createdAt: new Date('2024-01-12'),
                    status: 'open',
                },
            ];

            setTasks(mockTasks);

        } finally {
            setIsLoading(false);
            if (isRefresh) {
                setIsRefreshing(false);
            }
        }
    };

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadTasks(true);
    }, []);

    const handleTaskPress = useCallback((task: Task) => {
        navigation.navigateToTaskDetail(task);
    }, [navigation]);

    const handleViewPress = useCallback((task: Task) => {
        Alert.alert(
            task.title,
            task.description,
            [
                { text: 'Close', style: 'cancel' },
                { text: 'View Details', onPress: () => handleTaskPress(task) }
            ]
        );
    }, [handleTaskPress]);

    const retryLoad = () => {
        loadTasks();
    };

    const renderTaskItem = ({ item }: { item: Task }) => (
        <TaskCard
            task={item}
            onPress={handleTaskPress}
            onViewPress={handleViewPress}
            showViewButton={true}
        />
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Tasks Available</Text>
            <Text style={styles.emptyMessage}>
                Be the first to create a task and share it with the community!
            </Text>
            <LoadingButton
                title="Create Task"
                onPress={() => navigation.navigateToTaskForm()}
                variant="primary"
                size="medium"
                style={styles.createTaskButton}
            />
        </View>
    );

    const renderListHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Available Tasks</Text>
            <Text style={styles.subtitle}>
                Discover opportunities that match your skills
            </Text>
        </View>
    );

    const keyExtractor = (item: Task) => item.id;

    // Show loading screen on initial load
    if (isLoading && tasks.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading tasks...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show error screen if loading failed and no cached data
    if (loadError && tasks.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Unable to Load Tasks</Text>
                    <Text style={styles.errorMessage}>{loadError}</Text>
                    <LoadingButton
                        title="Retry"
                        onPress={retryLoad}
                        variant="primary"
                        size="medium"
                        style={styles.retryButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={renderListHeader}
                ListEmptyComponent={renderEmptyComponent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
                contentContainerStyle={[
                    styles.listContent,
                    tasks.length === 0 && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={5}
                getItemLayout={(data, index) => ({
                    length: 200, // Approximate item height
                    offset: 200 * index,
                    index,
                })}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 12,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    retryButton: {
        minWidth: 120,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    createTaskButton: {
        minWidth: 140,
    },
});

export default TaskFeedScreen;