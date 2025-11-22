// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
};

export default { API_URL, SOCKET_URL, apiCall };
