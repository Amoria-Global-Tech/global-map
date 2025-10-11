// api-conn.ts - Centralized API Connector
// All frontend requests should go through this single file

// Configuration
const PUBLIC_API_ENDPOINT_URL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL || 'http://localhost:5000/api'; // Change to your API base URL

// Global session expiry handler - will be set by AuthContext
let globalSessionExpiredHandler: ((redirectUrl?: string) => void) | null = null;

export const setSessionExpiredHandler = (handler: (redirectUrl?: string) => void) => {
  globalSessionExpiredHandler = handler;
};

// Types and Interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
  timestamp: string;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string | number>;
}

export interface LogEntry {
  timestamp: string;
  method: string;
  endpoint: string;
  fullUrl: string;
  requestData?: any;
  responseStatus: number;
  responseData?: any;
  error?: string;
  duration: number;
}

export interface Tour {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  image: string;
  isBestseller?: boolean;
  category: string;
}

export interface TourFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'reviews' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ToursResponse {
  tours: Tour[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Self-implemented Logger
class ApiLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs

  log(entry: LogEntry): void {
    // All console logging disabled
    this.logs.unshift(entry);

    // Keep only max logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Store in localStorage for persistence (optional)
    try {
      const storedLogs = JSON.parse(localStorage.getItem('api_logs') || '[]');
      storedLogs.unshift(entry);
      localStorage.setItem('api_logs', JSON.stringify(storedLogs.slice(0, 100)));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('api_logs');
  }

  getLogsByEndpoint(endpoint: string): LogEntry[] {
    return this.logs.filter(log => log.endpoint === endpoint);
  }

  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.responseStatus >= 400 || log.error);
  }
}

// Initialize logger
const logger = new ApiLogger();

// Utility Functions
function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  const baseUrl = `${PUBLIC_API_ENDPOINT_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value.toString());
  });

  return `${baseUrl}?${searchParams.toString()}`;
}

function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Main API Connector Class
class ApiConnector {
  [x: string]: any;
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = PUBLIC_API_ENDPOINT_URL, timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  // Generic request method
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const fullUrl = buildUrl(config.endpoint, config.params);

    const requestConfig: RequestInit = {
      method: config.method,
      headers: {
        ...getDefaultHeaders(),
        ...config.headers,
      },
    };

    // Add body for non-GET requests
    if (config.method !== 'GET' && config.data) {
      requestConfig.body = JSON.stringify(config.data);
    }

    // Setup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.defaultTimeout);

    try {
      const response = await fetch(fullUrl, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const duration = Date.now() - startTime;
      const apiResponse: ApiResponse<T> = {
        success: response.ok,
        data: response.ok ? responseData : undefined,
        error: response.ok ? undefined : responseData?.message || responseData || 'Request failed',
        message: responseData?.message,
        status: response.status,
        timestamp,
      };

      // Handle 401 Unauthorized - Session expired
      // Only trigger session expired modal if user was actually authenticated
      if (response.status === 401 && globalSessionExpiredHandler) {
        const hadAuthToken = typeof window !== 'undefined' &&
          (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'));

        // Only show session expired modal if user had auth tokens
        if (hadAuthToken) {
          const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : undefined;
          globalSessionExpiredHandler(currentUrl);
        }
      }

      // Log the request
      logger.log({
        timestamp,
        method: config.method,
        endpoint: config.endpoint,
        fullUrl,
        requestData: config.data,
        responseStatus: response.status,
        responseData: responseData,
        error: response.ok ? undefined : apiResponse.error,
        duration,
      });

      return apiResponse;

    } catch (error: any) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      const errorMessage = error.name === 'AbortError' ? 'Request timeout' : error.message || 'Network error';

      const apiResponse: ApiResponse<T> = {
        success: false,
        error: errorMessage,
        status: 0,
        timestamp,
      };

      // Log the error
      logger.log({
        timestamp,
        method: config.method,
        endpoint: config.endpoint,
        fullUrl,
        requestData: config.data,
        responseStatus: 0,
        error: errorMessage,
        duration,
      });

      return apiResponse;
    }
  }

  // Convenience methods for different HTTP verbs
  async get<T = any>(
    endpoint: string, 
    params?: Record<string, string | number>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      params,
      headers,
    });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      headers,
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data,
      headers,
    });
  }

  async delete<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      endpoint,
      data,
      headers,
    });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      data,
      headers,
    });
  }

  // Upload files
  async upload<T = any>(
    endpoint: string,
    file: File | FormData,
    progressCallback?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const fullUrl = buildUrl(endpoint);

    try {
      const formData = file instanceof FormData ? file : new FormData();
      if (file instanceof File) {
        formData.append('file', file);
      }

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData, browser will set it with boundary
          'Authorization': getDefaultHeaders()['Authorization'] || '',
        },
        body: formData,
      });

      const responseData = await response.json();
      const duration = Date.now() - startTime;

      const apiResponse: ApiResponse<T> = {
        success: response.ok,
        data: response.ok ? responseData : undefined,
        error: response.ok ? undefined : responseData?.message || 'Upload failed',
        message: responseData?.message,
        status: response.status,
        timestamp,
      };

      // Log upload
      logger.log({
        timestamp,
        method: 'POST',
        endpoint,
        fullUrl,
        requestData: { fileUpload: true, fileName: file instanceof File ? file.name : 'FormData' },
        responseStatus: response.status,
        responseData,
        error: response.ok ? undefined : apiResponse.error,
        duration,
      });

      return apiResponse;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      const apiResponse: ApiResponse<T> = {
        success: false,
        error: error.message || 'Upload failed',
        status: 0,
        timestamp,
      };

      logger.log({
        timestamp,
        method: 'POST',
        endpoint,
        fullUrl,
        requestData: { fileUpload: true, error: true },
        responseStatus: 0,
        error: error.message,
        duration,
      });

      return apiResponse;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  // Get logger instance
  getLogger(): ApiLogger {
    return logger;
  }
}

// Create and export the default instance
const apiConnector = new ApiConnector();

// Export everything
export { apiConnector as default, ApiConnector, ApiLogger, logger };

// Export convenience functions for direct use
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string | number>, headers?: Record<string, string>) => 
    apiConnector.get<T>(endpoint, params, headers),
    
  post: <T = any>(endpoint: string, data?: any, headers?: Record<string, string>) => 
    apiConnector.post<T>(endpoint, data, headers),
    
  put: <T = any>(endpoint: string, data?: any, headers?: Record<string, string>) => 
    apiConnector.put<T>(endpoint, data, headers),
    
  delete: <T = any>(endpoint: string, data?: any, headers?: Record<string, string>) => 
    apiConnector.delete<T>(endpoint, data, headers),
    
  patch: <T = any>(endpoint: string, data?: any, headers?: Record<string, string>) => 
    apiConnector.patch<T>(endpoint, data, headers),
    
  upload: <T = any>(endpoint: string, file: File | FormData, progressCallback?: (progress: number) => void) => 
    apiConnector.upload<T>(endpoint, file, progressCallback),
    
  healthCheck: () => apiConnector.healthCheck(),
  
  // Utility methods
  getLogs: () => logger.getLogs(),
  clearLogs: () => logger.clearLogs(),
  getErrorLogs: () => logger.getErrorLogs(),
  getLogsByEndpoint: (endpoint: string) => logger.getLogsByEndpoint(endpoint),


  getTourCategories: async (): Promise<ApiResponse<{ success: boolean; data: string[] }>> => {
    const response = await apiConnector.get<string[]>('/tours/categories');
    return {
      ...response,
      data: {
        success: response.success,
        data: response.data || []
      }
    };
  },

  searchTours: async (filters?: TourFilters): Promise<ApiResponse<{ success: boolean; data: ToursResponse }>> => {
    const params: Record<string, string | number> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });
    }

    const response = await apiConnector.get<ToursResponse>('/tours/search', params);
    return {
      ...response,
      data: {
        success: response.success,
        data: response.data || { tours: [], total: 0, page: 1, limit: 10, totalPages: 0 }
      }
    };
  },

  getTours: async (filters?: TourFilters): Promise<ApiResponse<{ success: boolean; data: ToursResponse }>> => {
    return api.searchTours(filters);
  },

  getTour: async (id: string): Promise<ApiResponse<{ success: boolean; data: Tour }>> => {
    const response = await apiConnector.get<Tour>(`/tours/${id}`);
    return {
      ...response,
      data: {
        success: response.success,
        data: response.data || {} as Tour
      }
    };
  },

  getFeaturedTours: async (limit: number = 12): Promise<ApiResponse<{ success: boolean; data: ToursResponse }>> => {
    const response = await apiConnector.get<ToursResponse>('/tours/featured', { limit });
    return {
      ...response,
      data: {
        success: response.success,
        data: response.data || { tours: [], total: 0, page: 1, limit, totalPages: 0 }
      }
    };
  },

  getTourLocations: async (): Promise<ApiResponse<{ success: boolean; data: string[] }>> => {
    const response = await apiConnector.get<string[]>('/tours/locations');
    return {
      ...response,
      data: {
        success: response.success,
        data: response.data || []
      }
    };
  }
};
