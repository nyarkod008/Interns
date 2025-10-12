import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const OfflineIndicator: React.FC = () => {
    const networkStatus = useNetworkStatus();

    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {!networkStatus.isConnected
                    ? 'No Internet Connection'
                    : 'Limited Connectivity'
                }
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e74c3c',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default OfflineIndicator;