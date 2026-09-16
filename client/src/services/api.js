const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const getToken = () => {
  const directToken = localStorage.getItem('token');
  if (directToken) return directToken;
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.token || null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  if (token) {
    localStorage.setItem('token', token);
    const userInfo = { ...user, token };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
};

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    clearAuthData();
    window.dispatchEvent(new CustomEvent('auth:expired'));
    const error = new Error('Session expired. Please log in again.');
    error.status = 401;
    throw error;
  }

  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = (typeof data === 'object' && data?.message) ? data.message : `Server error (${res.status})`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.code = (typeof data === 'object' && data?.error) ? data.error : 'error';
    throw err;
  }

  return data;
};

export const authApi = {
  register: async ({ name, email, password, company }) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, company }),
    });
    const data = await handleResponse(res);
    if (data.token && data.user) {
      setAuthData(data.token, data.user);
    }
    return data;
  },

  login: async ({ email, password }) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    if (data.token && data.user) {
      setAuthData(data.token, data.user);
    }
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export const contractApi = {
  getContracts: async () => {
    const res = await fetch(`${BACKEND_URL}/api/contracts`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getContract: async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/contracts/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createContract: async ({ title, contractType }) => {
    const res = await fetch(`${BACKEND_URL}/api/contracts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, contractType }),
    });
    return handleResponse(res);
  },

  deleteContract: async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/contracts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getVersions: async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/contracts/${id}/versions`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getVersion: async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/versions/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  analyzeContract: async ({ file, contractId }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (contractId) {
      formData.append('contractId', contractId);
    }

    const res = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  getAnalysis: async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/contracts/${id}/analysis`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  downloadReport: async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/contracts/${id}/report`, {
      headers: getHeaders(),
    });
    if (res.status === 401) {
      clearAuthData();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      const error = new Error('Session expired. Please log in again.');
      error.status = 401;
      throw error;
    }
    if (!res.ok) {
      let errorMsg = 'Failed to generate PDF report.';
      try {
        const errorData = await res.json();
        if (errorData?.message) errorMsg = errorData.message;
      } catch (e) {}
      const err = new Error(errorMsg);
      err.status = res.status;
      throw err;
    }
    return res.blob();
  },
};
