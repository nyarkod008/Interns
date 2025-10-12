import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormInput, LoadingButton } from '../components';
import { CreateTaskRequest } from '../types';
import { taskService } from '../services';
import { useAppNavigation } from '../hooks';

interface TaskFormData {
    title: string;
    description: string;
    category: string;
    requiredSkills: string;
}

const TaskFormScreen: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useAppNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            category: '',
            requiredSkills: '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            setIsSubmitting(true);

            // Convert skills string to array
            const skillsArray = data.requiredSkills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            const taskData: CreateTaskRequest = {
                title: data.title.trim(),
                description: data.description.trim(),
                category: data.category.trim(),
                requiredSkills: skillsArray,
            };

            // Validate task data before submission
            const validationErrors = taskService.validateTask(taskData);
            if (validationErrors.length > 0) {
                Alert.alert('Validation Error', validationErrors.join('\n'));
                return;
            }

            // Call the task service to create the task
            const newTask = await taskService.createTask(taskData);

            // Reset form after successful submission
            reset();

            Alert.alert(
                'Success',
                'Task created successfully!',
                [
                    {
                        text: 'View Tasks',
                        onPress: () => navigation.navigateToTaskFeed(),
                    },
                    {
                        text: 'Create Another',
                        style: 'cancel',
                    },
                ]
            );

        } catch (error: any) {
            console.error('Failed to create task:', error);

            let errorMessage = 'Failed to create task. Please try again.';

            // Handle specific error types
            if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert(
                'Error',
                errorMessage,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Retry', onPress: () => onSubmit(data) }
                ]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateSkills = (value: string) => {
        if (!value || value.trim().length === 0) {
            return 'At least one required skill must be specified';
        }

        const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        if (skills.length === 0) {
            return 'At least one required skill must be specified';
        }

        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Create New Task</Text>
                        <Text style={styles.subtitle}>
                            Share a task with the community and find the right person for the job
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <FormInput
                            name="title"
                            control={control}
                            label="Task Title"
                            placeholder="Enter a clear, descriptive title"
                            error={errors.title}
                            required
                            rules={{
                                required: 'Title is required',
                                minLength: {
                                    value: 3,
                                    message: 'Title must be at least 3 characters',
                                },
                                maxLength: {
                                    value: 100,
                                    message: 'Title must be less than 100 characters',
                                },
                            }}
                            autoCapitalize="sentences"
                        />

                        <FormInput
                            name="description"
                            control={control}
                            label="Description"
                            placeholder="Provide detailed information about the task, requirements, and expectations..."
                            error={errors.description}
                            required
                            multiline
                            numberOfLines={6}
                            rules={{
                                required: 'Description is required',
                                minLength: {
                                    value: 10,
                                    message: 'Description must be at least 10 characters',
                                },
                                maxLength: {
                                    value: 1000,
                                    message: 'Description must be less than 1000 characters',
                                },
                            }}
                            autoCapitalize="sentences"
                        />

                        <FormInput
                            name="category"
                            control={control}
                            label="Category"
                            placeholder="e.g., Development, Design, Marketing, Writing"
                            error={errors.category}
                            required
                            rules={{
                                required: 'Category is required',
                                minLength: {
                                    value: 2,
                                    message: 'Category must be at least 2 characters',
                                },
                            }}
                            autoCapitalize="words"
                        />

                        <FormInput
                            name="requiredSkills"
                            control={control}
                            label="Required Skills"
                            placeholder="React Native, JavaScript, UI/UX Design (comma separated)"
                            error={errors.requiredSkills}
                            required
                            rules={{
                                validate: validateSkills,
                            }}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <LoadingButton
                            title="Create Task"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                            disabled={!isDirty || isSubmitting}
                            variant="primary"
                            size="large"
                            style={styles.submitButton}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
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
    form: {
        paddingHorizontal: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    submitButton: {
        width: '100%',
    },
});

export default TaskFormScreen;