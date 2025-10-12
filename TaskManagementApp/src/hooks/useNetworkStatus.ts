import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
    isConnected: boolean;
    isInternetReachable: boolean;
    type: string | null;
    isWifiEnabled: boolean;
}

export const useNetworkStatus = () => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        isConnected: true, // Assume connected initially
        isInternetReachable: true,
        type: null,
        isWifiEnabled: false,
    });

    useEffect(() => {
        // Get initial network state
        NetInfo.fetch().then((state: NetInfoState) => {
            setNetworkStatus({
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable ?? false,
                type: state.type,
                isWifiEnabled: state.type === 'wifi',
            });
        });

        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setNetworkStatus({
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable ?? false,
                type: state.type,
                isWifiEnabled: state.type === 'wifi',
            });
        });

        // Cleanup subscription
        return () => {
            unsubscribe();
        };
    }, []);

    return networkStatus;
};