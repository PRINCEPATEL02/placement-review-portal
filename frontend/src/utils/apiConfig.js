export const getApiUrl = (endpoint) => {
    const baseUrl = window.location.hostname === 'localhost'
        ? "http://localhost:5000/api"
        : "https://placement-review-portal.onrender.com/api";
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};
