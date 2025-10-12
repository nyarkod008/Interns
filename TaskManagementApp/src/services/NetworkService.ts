import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types';

class NetworkService {
    private client: AxiosInstance;
    private baseURL: string;

    constructor(baseURL: string = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000, // 10 second timeout as per requirements
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
                return config;
            },
            (error) => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`Response received from ${response.config.url}:`, response.status);
                return response;
            },
            (error: AxiosError) => {
                console.error('Response error:', error.message);
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError): ApiError {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data?.message || 'Server error occurred',
                code: error.response.status.toString(),
                details: error.response.data,
            };
        } else if (error.request) {
            // Network error
            return {
                message: 'Network error - please check your connection',
                code: 'NETWORK_ERROR',
                details: error.message,
            };
        } else {
            // Other error
            return {
                message: error.message || 'An unexpected error occurred',
                code: 'UNKNOWN_ERROR',
                details: error,
            };
        }
    }

    async get<T>(url: string): Promise<T> {
        try {
            const response = await this.client.get<ApiResponse<T>>(url);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async post<T>(url: string, data: any): Promise<T> {
        try {
            const response = await this.client.post<ApiResponse<T>>(url, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async put<T>(url: string, data: any): Promise<T> {
        try {
            const response = await this.client.put<ApiResponse<T>>(url, data);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    // Method to update base URL if needed
    updateBaseURL(newBaseURL: string) {
        this.baseURL = newBaseURL;
        this.client.defaults.baseURL = newBaseURL;
    }

    // Method to add authorization header
    setAuthToken(token: string) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Method to remove authorization header
    removeAuthToken() {
        delete this.client.defaults.headers.common['Authorization'];
    }
}

// Export singleton instance
export const networkService = new NetworkService();
export default NetworkService;