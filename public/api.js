// API Client for BEST Management System
const API_BASE = '/api';

let token = localStorage.getItem('token');

// Set token
const setToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
};

// Get token
const getToken = () => token;

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }

  return response.json();
};

// Auth API
const authAPI = {
  login: async (username, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.token);
    return data.user;
  },
  logout: () => {
    setToken(null);
  },
  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

// Users API
const usersAPI = {
  getAll: async () => apiCall('/users'),
  create: async (user) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: async (id, user) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  delete: async (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Sales API
const salesAPI = {
  getAll: async () => apiCall('/sales'),
  create: async (sale) => apiCall('/sales', {
    method: 'POST',
    body: JSON.stringify(sale),
  }),
  update: async (id, sale) => apiCall(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sale),
  }),
  delete: async (id) => apiCall(`/sales/${id}`, {
    method: 'DELETE',
  }),
};

// Expenses API
const expensesAPI = {
  getAll: async () => apiCall('/expenses'),
  create: async (expense) => apiCall('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  }),
  update: async (id, expense) => apiCall(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  }),
  delete: async (id) => apiCall(`/expenses/${id}`, {
    method: 'DELETE',
  }),
};

// Payments API
const paymentsAPI = {
  getAll: async () => apiCall('/payments'),
  create: async (payment) => apiCall('/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
  update: async (id, payment) => apiCall(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payment),
  }),
  delete: async (id) => apiCall(`/payments/${id}`, {
    method: 'DELETE',
  }),
};

// Customers API
const customersAPI = {
  getAll: async () => apiCall('/customers'),
  create: async (customer) => apiCall('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  }),
  update: async (id, customer) => apiCall(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer),
  }),
  delete: async (id) => apiCall(`/customers/${id}`, {
    method: 'DELETE',
  }),
};

// Categories API
const categoriesAPI = {
  getAll: async (type) => apiCall(`/categories${type ? `?type=${type}` : ''}`),
  create: async (category) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: async (id, category) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  delete: async (id) => apiCall(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Activity Logs API
const logsAPI = {
  getAll: async () => apiCall('/logs'),
  create: async (log) => apiCall('/logs', {
    method: 'POST',
    body: JSON.stringify(log),
  }),
};

// Delete Requests API
const delreqsAPI = {
  getAll: async () => apiCall('/delreqs'),
  create: async (delreq) => apiCall('/delreqs', {
    method: 'POST',
    body: JSON.stringify(delreq),
  }),
  update: async (id, delreq) => apiCall(`/delreqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(delreq),
  }),
  delete: async (id) => apiCall(`/delreqs/${id}`, {
    method: 'DELETE',
  }),
};
