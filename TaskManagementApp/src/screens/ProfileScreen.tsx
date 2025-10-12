import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormInput, LoadingButton } from '../components';
import { UserProfile } from '../types';
import { profileService } from '../services';

interface ProfileFormData {
    name: string;
    bio: string;
    skills: string;
    location: string;
}

const ProfileScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue,
    } = useForm<ProfileFormData>({
        defaultValues: {
            name: '',
            bio: '',
            skills: '',
            location: '',
        },
    });

    // Load profile data on component mount
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setIsLoading(true);
            setLoadError(null);

            const profile = await profileService.getProfile();

            // Convert skills array to comma-separated string
            const skillsString = profile.skills.join(', ');

            // Update form with loaded data
            setValue('name', profile.name);
            setValue('bio', profile.bio);
            setValue('skills', skillsString);
            setValue('location', profile.location);

            // Reset form dirty state since we're loading initial data
            reset({
                name: profile.name,
                bio: profile.bio,
                skills: skillsString,
                location: profile.location,
            });

        } catch (error: any) {
            console.error('Failed to load profile:', error);
            setLoadError(error.message || 'Failed to load profile data');

            // Show mock data for development
            const mockProfile = {
                name: 'John Doe',
                bio: 'Passionate mobile developer with 5+ years of experience in React Native and iOS development.',
                skills: 'React Native, JavaScript, TypeScript, iOS, Android',
                location: 'San Francisco, CA',
            };

            setValue('name', mockProfile.name);
            setValue('bio', mockProfile.bio);
            setValue('skills', mockProfile.skills);
            setValue('location', mockProfile.location);

            reset(mockProfile);

        } finally {
            setIsLoading(false);
        }
    };

    const retryLoad = () => {
        loadProfileData();
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            setIsSaving(true);

            // Convert skills string to array
            const skillsArray = data.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);

            const profileData: Partial<UserProfile> = {
                name: data.name.trim(),
                bio: data.bio.trim(),
                skills: skillsArray,
                location: data.location.trim(),
            };

            // Validate profile data before submission
            const validationErrors = profileService.validateProfile(profileData);
            if (validationErrors.length > 0) {
                Alert.alert('Validation Error', validationErrors.join('\n'));
                return;
            }

            // Call the profile service to update the profile
            const updatedProfile = await profileService.updateProfile(profileData);

            // Update form with the response data (in case server modified anything)
            const updatedSkillsString = updatedProfile.skills.join(', ');
            reset({
                name: updatedProfile.name,
                bio: updatedProfile.bio,
                skills: updatedSkillsString,
                location: updatedProfile.location,
            });

            Alert.alert(
                'Success',
                'Profile updated successfully!',
                [{ text: 'OK', style: 'default' }]
            );

        } catch (error: any) {
            console.error('Failed to save profile:', error);

            let errorMessage = 'Failed to save profile. Please try again.';

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
            setIsSaving(false);
        }
    };

    const validateSkills = (value: string) => {
        if (!value || value.trim().length === 0) {
            return 'At least one skill is required';
        }

        const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        if (skills.length === 0) {
            return 'At least one skill is required';
        }

        return true;
    };

    // Show loading screen while data is being fetched
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show error screen if loading failed
    if (loadError) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Unable to Load Profile</Text>
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
                        <Text style={styles.title}>My Profile</Text>
                        <Text style={styles.subtitle}>
                            Update your information to help others find you
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <FormInput
                            name="name"
                            control={control}
                            label="Full Name"
                            placeholder="Enter your full name"
                            error={errors.name}
                            required
                            rules={{
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters',
                                },
                                maxLength: {
                                    value: 100,
                                    message: 'Name must be less than 100 characters',
                                },
                            }}
                            autoCapitalize="words"
                            autoComplete="name"
                        />

                        <FormInput
                            name="bio"
                            control={control}
                            label="Bio"
                            placeholder="Tell others about yourself..."
                            error={errors.bio}
                            multiline
                            numberOfLines={4}
                            rules={{
                                maxLength: {
                                    value: 500,
                                    message: 'Bio must be less than 500 characters',
                                },
                            }}
                            autoCapitalize="sentences"
                        />

                        <FormInput
                            name="skills"
                            control={control}
                            label="Skills"
                            placeholder="React Native, JavaScript, UI/UX (comma separated)"
                            error={errors.skills}
                            required
                            rules={{
                                validate: validateSkills,
                            }}
                            autoCapitalize="words"
                        />

                        <FormInput
                            name="location"
                            control={control}
                            label="Location"
                            placeholder="City, Country"
                            error={errors.location}
                            required
                            rules={{
                                required: 'Location is required',
                                minLength: {
                                    value: 2,
                                    message: 'Location must be at least 2 characters',
                                },
                            }}
                            autoCapitalize="words"
                            autoComplete="address-line1"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <LoadingButton
                            title="Save Profile"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSaving}
                            disabled={!isDirty || isSaving}
                            variant="primary"
                            size="large"
                            style={styles.saveButton}
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
    saveButton: {
        width: '100%',
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
});

export default ProfileScreen;