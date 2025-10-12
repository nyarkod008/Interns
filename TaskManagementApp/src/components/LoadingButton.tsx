import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';

interface LoadingButtonProps extends Omit<TouchableOpacityProps, 'style'> {
    title: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    title,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'medium',
    style,
    textStyle,
    onPress,
    ...touchableProps
}) => {
    const isDisabled = disabled || loading;

    const getButtonStyle = (): ViewStyle[] => {
        const baseStyle = [styles.button, styles[`${size}Button`]];

        if (variant === 'primary') {
            baseStyle.push(styles.primaryButton);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryButton);
        } else if (variant === 'danger') {
            baseStyle.push(styles.dangerButton);
        }

        if (isDisabled) {
            baseStyle.push(styles.disabledButton);
        }

        if (style) {
            baseStyle.push(style);
        }

        return baseStyle;
    };

    const getTextStyle = (): TextStyle[] => {
        const baseStyle = [styles.text, styles[`${size}Text`]];

        if (variant === 'primary') {
            baseStyle.push(styles.primaryText);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryText);
        } else if (variant === 'danger') {
            baseStyle.push(styles.dangerText);
        }

        if (isDisabled) {
            baseStyle.push(styles.disabledText);
        }

        if (textStyle) {
            baseStyle.push(textStyle);
        }

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={isDisabled ? undefined : onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{
                disabled: isDisabled,
                busy: loading,
            }}
            {...touchableProps}
        >
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={variant === 'secondary' ? '#007AFF' : '#fff'}
                    style={styles.loader}
                />
            )}
            <Text style={getTextStyle()}>
                {loading ? 'Loading...' : title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
    },

    // Size variants
    smallButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 36,
    },
    mediumButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
    largeButton: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 56,
    },

    // Color variants
    primaryButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderColor: '#007AFF',
    },
    dangerButton: {
        backgroundColor: '#e74c3c',
        borderColor: '#e74c3c',
    },
    disabledButton: {
        backgroundColor: '#f0f0f0',
        borderColor: '#ddd',
    },

    // Text styles
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },

    // Text color variants
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: '#007AFF',
    },
    dangerText: {
        color: '#fff',
    },
    disabledText: {
        color: '#999',
    },

    loader: {
        marginRight: 8,
    },
});

export default LoadingButton;