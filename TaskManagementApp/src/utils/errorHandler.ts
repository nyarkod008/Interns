import { Alert } from 'react-native';
import { ApiError } from '../types';

export class GlobalErrorHandler {
    private static instance: GlobalErrorHandler;

    private constructor() { }

    static getInstance(): GlobalErrorHandler {
        if (!GlobalErrorHandler.instance) {
            GlobalErrorHandler.instance = new GlobalErrorHandler();
        }
        return GlobalErrorHandler.instance;
    }

    // Handle API errors with user-friendly messages
    handleApiError(error: ApiError, context?: string): void {
        console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

        let title = 'Error';
        let message = error.message || 'An unexpected error occurred';

        // Customize messages based on error codes
        switch (error.code) {
            case 'NETWORK_ERROR':
                title = 'Connection Error';
                message = 'Please check your internet connection and try again.';
                break;
            case '401':
                title = 'Authentication Error';
                message = 'Please log in again to continue.';
                break;
            case '403':
                title = 'Access Denied';
                message = 'You don\'t have permission to perform this action.';
                break;
            case '404':
                title = 'Not Found';
                message = 'The requested resource was not found.';
                break;
            case '500':
                title = 'Server Error';
                message = 'Our servers are experiencing issues. Please try again later.';
                break;
            case 'TIMEOUT_ERROR':
                title = 'Request Timeout';
                message = 'The request took too long. Please try again.';
                break;
            default:
                if (error.code && error.code.startsWith('4')) {
                    title = 'Request Error';
                } else if (error.code && error.code.startsWith('5')) {
                    title = 'Server Error';
                    message = 'Our servers are experiencing issues. Please try again later.';
                }
        }

        Alert.alert(title, message);
    }

    // Handle general errors
    handleError(error: Error, context?: string): void {
        console.error(`Error${context ? ` in ${context}` : ''}:`, error);

        Alert.alert(
            'Error',
            error.message || 'An unexpected error occurred',
            [{ text: 'OK' }]
        );
    }

    // Handle validation errors
    handleValidationErrors(errors: string[], context?: string): void {
        console.warn(`Validation errors${context ? ` in ${context}` : ''}:`, errors);

        Alert.alert(
            'Validation Error',
            errors.join('\n'),
            [{ text: 'OK' }]
        );
    }

    // Show success message
    showSuccess(message: string, title: string = 'Success'): void {
        Alert.alert(title, message, [{ text: 'OK' }]);
    }

    // Show confirmation dialog
    showConfirmation(
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    ): void {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: onCancel,
                },
                {
                    text: 'Confirm',
                    onPress: onConfirm,
                },
            ]
        );
    }

    // Handle retry scenarios
    showRetryDialog(
        title: string,
        message: string,
        onRetry: () => void,
        onCancel?: () => void
    ): void {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: onCancel,
                },
                {
                    text: 'Retry',
                    onPress: onRetry,
                },
            ]
        );
    }
}

// Export singleton instance
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleNetworkError = (context?: string) => {
    globalErrorHandler.handleApiError(
        {
            message: 'Network error occurred',
            code: 'NETWORK_ERROR',
        },
        context
    );
};

export const handleTimeoutError = (context?: string) => {
    globalErrorHandler.handleApiError(
        {
            message: 'Request timed out',
            code: 'TIMEOUT_ERROR',
        },
        context
    );
};

export const handleUnknownError = (context?: string) => {
    globalErrorHandler.handleError(
        new Error('An unknown error occurred'),
        context
    );
};