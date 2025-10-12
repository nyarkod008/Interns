import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';

interface FormInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    name: string;
    control: Control<any>;
    label: string;
    placeholder?: string;
    error?: FieldError;
    multiline?: boolean;
    numberOfLines?: number;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
    name,
    control,
    label,
    placeholder,
    error,
    multiline = false,
    numberOfLines = 1,
    required = false,
    ...textInputProps
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>

            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            multiline && styles.multilineInput,
                            error && styles.inputError,
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline={multiline}
                        numberOfLines={multiline ? numberOfLines : 1}
                        textAlignVertical={multiline ? 'top' : 'center'}
                        accessibilityLabel={label}
                        accessibilityHint={placeholder}
                        {...textInputProps}
                    />
                )}
            />

            {error && (
                <Text style={styles.errorText} accessibilityRole="alert">
                    {error.message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#e74c3c',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 48,
    },
    multilineInput: {
        minHeight: 100,
        paddingTop: 12,
    },
    inputError: {
        borderColor: '#e74c3c',
        borderWidth: 2,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default FormInput;