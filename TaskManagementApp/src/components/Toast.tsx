import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
    duration?: number;
    onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type = 'info',
    duration = 3000,
    onHide,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible, duration]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    const getToastStyle = () => {
        switch (type) {
            case 'success':
                return styles.success;
            case 'error':
                return styles.error;
            case 'warning':
                return styles.warning;
            case 'info':
            default:
                return styles.info;
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <TouchableOpacity
                style={[styles.toast, getToastStyle()]}
                onPress={hideToast}
                activeOpacity={0.8}
            >
                <Text style={styles.message}>{message}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        alignItems: 'center',
    },
    toast: {
        maxWidth: width - 32,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    message: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    success: {
        backgroundColor: '#28a745',
    },
    error: {
        backgroundColor: '#dc3545',
    },
    warning: {
        backgroundColor: '#ffc107',
    },
    info: {
        backgroundColor: '#007AFF',
    },
});

export default Toast;