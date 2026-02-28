const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    };

    console.log('API Request:', { url, method: config.method, body: options?.body });

    const response = await fetch(url, config);
    const data = await response.json();

    console.log('API Response:', { status: response.status, data });

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  // User endpoints
  async updateOnboarding(data: {
    destination: string;
    travelDate: string;
    purpose: string;
    selectedPlanId: string;
    paymentPlan: string;
  }) {
    try {
      const response = await this.request<any>('/user/onboarding', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Insurance endpoints
  async getInsurancePlans() {
    return this.request<any[]>('/insurance/options');
  }

  async createPolicy(data: {
    userId: string;
    planId: string;
    paymentId: string;
    startDate: string;
    endDate: string;
  }) {
    return this.request<any>('/insurance/policy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createInsurancePlan(data: {
    name: string;
    description?: string;
    price: number;
    coverage: string[];
    duration: number;
  }) {
    return this.request<any>('/insurance/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInsurancePlan(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    coverage: string[];
    duration: number;
  }>) {
    return this.request<any>(`/insurance/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInsurancePlan(id: string) {
    return this.request<any>(`/insurance/plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async createPayment(data: {
    amount: number;
    currency?: string;
    method?: string;
  }) {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.request<any>(`/payments/${paymentId}`);
  }

  async getUserPayments() {
    return this.request<{ payments: any[]; totalPaid: number }>('/payments/user/history');
  }

  async getAllPayments() {
    return this.request<any[]>('/payments/admin/all');
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request<any[]>('/insurance/admin/users');
  }
}

export const api = new ApiClient(API_BASE_URL);
