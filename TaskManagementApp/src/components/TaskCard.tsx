import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Task } from '../types';
import LoadingButton from './LoadingButton';

interface TaskCardProps {
    task: Task;
    onPress?: (task: Task) => void;
    onViewPress?: (task: Task) => void;
    style?: ViewStyle;
    showViewButton?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onPress,
    onViewPress,
    style,
    showViewButton = true,
}) => {
    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'open':
                return '#28a745';
            case 'in_progress':
                return '#ffc107';
            case 'completed':
                return '#6c757d';
            default:
                return '#007AFF';
        }
    };

    const getStatusText = (status: Task['status']) => {
        switch (status) {
            case 'open':
                return 'Open';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleCardPress = () => {
        if (onPress) {
            onPress(task);
        }
    };

    const handleViewPress = () => {
        if (onViewPress) {
            onViewPress(task);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handleCardPress}
            activeOpacity={onPress ? 0.7 : 1}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            accessibilityHint="Tap to view task details"
        >
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>
                    {task.title}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={styles.statusText}>
                        {getStatusText(task.status)}
                    </Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>
                {task.description}
            </Text>

            <View style={styles.metaContainer}>
                <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Category:</Text>
                    <Text style={styles.metaValue}>{task.category}</Text>
                </View>

                <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Created by:</Text>
                    <Text style={styles.metaValue}>{task.createdByName}</Text>
                </View>

                <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Date:</Text>
                    <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
                </View>
            </View>

            {task.requiredSkills.length > 0 && (
                <View style={styles.skillsContainer}>
                    <Text style={styles.skillsLabel}>Required Skills:</Text>
                    <View style={styles.skillsWrapper}>
                        {task.requiredSkills.slice(0, 3).map((skill, index) => (
                            <View key={index} style={styles.skillTag}>
                                <Text style={styles.skillText}>{skill}</Text>
                            </View>
                        ))}
                        {task.requiredSkills.length > 3 && (
                            <View style={styles.skillTag}>
                                <Text style={styles.skillText}>+{task.requiredSkills.length - 3}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {showViewButton && (
                <View style={styles.buttonContainer}>
                    <LoadingButton
                        title="View Details"
                        variant="primary"
                        size="small"
                        onPress={handleViewPress}
                        style={styles.viewButton}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    metaContainer: {
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    metaLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        width: 80,
    },
    metaValue: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    skillsContainer: {
        marginBottom: 16,
    },
    skillsLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    skillsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillTag: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    skillText: {
        fontSize: 12,
        color: '#495057',
        fontWeight: '500',
    },
    buttonContainer: {
        alignItems: 'flex-end',
    },
    viewButton: {
        minWidth: 100,
    },
});

export default TaskCard;