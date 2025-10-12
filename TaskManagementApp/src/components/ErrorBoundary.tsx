import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoadingButton } from './LoadingButton';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error);
        console.error('Error info:', errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Here you could send error reports to a crash reporting service
        // Example: Crashlytics.recordError(error);
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Oops! Something went wrong</Text>
                        <Text style={styles.message}>
                            We're sorry, but something unexpected happened. Please try again.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.debugContainer}>
                                <Text style={styles.debugTitle}>Debug Info:</Text>
                                <Text style={styles.debugText}>
                                    {this.state.error.toString()}
                                </Text>
                                {this.state.errorInfo && (
                                    <Text style={styles.debugText}>
                                        {this.state.errorInfo.componentStack}
                                    </Text>
                                )}
                            </View>
                        )}

                        <LoadingButton
                            title="Try Again"
                            onPress={this.handleRetry}
                            variant="primary"
                            size="medium"
                            style={styles.retryButton}
                        />
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    debugContainer: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 24,
        width: '100%',
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
    },
    retryButton: {
        minWidth: 120,
    },
});

export default ErrorBoundary;