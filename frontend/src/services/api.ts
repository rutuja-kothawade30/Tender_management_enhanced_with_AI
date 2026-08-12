const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  username: string;
  email: string;
  role: string;
}

export interface CompanyProfile {
  id?: number;
  company_name: string;
  turnover: number;
  experience_years: number;
  similar_projects_completed: number;
  max_project_value: number;
  certifications: string;
  equipment: string;
  manpower_count: number;
}

export interface TenderClause {
  id: number;
  category: string;
  clause_text: string;
  required_value: string;
  user_value: string;
  status: string; // PASS, FAIL, WARN
  explanation: string;
  confidence: number;
}

export interface TenderAmendment {
  id: number;
  tender_id: number;
  title: string;
  changes_summary: string;
  file_path: string;
  date_uploaded: string;
}

export interface DocumentChecklist {
  id: number;
  tender_id: number;
  document_name: string;
  required_by_date: string;
  status: string; // missing, uploaded, vault_matched
  matching_vault_doc: string;
}

export interface Tender {
  id: number;
  title: string;
  organization: string;
  value: number;
  EMD: number;
  submission_deadline: string;
  summary: string;
  file_path: string;
  status: string;
  overall_risk_score: number;
  financial_risk: number;
  technical_risk: number;
  compliance_risk: number;
  documentation_risk: number;
  confidence_score: number;
  created_at: string;
  
  // Suitability & Go / No-Go (v3.0)
  suitability_score: number;
  profitability_rating: number;
  competition_rating: number;
  difficulty_rating: number;
  distance_rating: number;
  bid_readiness_score: number;
  go_no_go_verdict: string;
  go_no_go_reason: string;
  action_plan_json: string;
  contradictions_json: string;
  pre_bid_questions_json: string;
  is_bookmarked: boolean;
  
  clauses: TenderClause[];
  amendments: TenderAmendment[];
  checklist: DocumentChecklist[];
}

export interface ChatResponse {
  answer: string;
  references: string[];
}

export interface SimilarTender {
  tender_id: number;
  title: string;
  summary: string;
  similarity_score: number;
}

// Token helper
export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
};

const getHeaders = (isMultipart = false) => {
  const headers: HeadersInit = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    setAuthToken(data.access_token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    return data;
  },

  register: async (username: string, email: string, password: string, role = 'employee') => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to get user profile');
    return res.json();
  },

  // Company Profile
  getProfile: async (): Promise<CompanyProfile> => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to get company profile');
    return res.json();
  },

  updateProfile: async (profile: CompanyProfile): Promise<CompanyProfile> => {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to update company profile');
    return res.json();
  },

  // Tenders
  getTenders: async (): Promise<Tender[]> => {
    const res = await fetch(`${API_BASE_URL}/tenders`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to get tenders');
    return res.json();
  },

  getTender: async (id: number): Promise<Tender> => {
    const res = await fetch(`${API_BASE_URL}/tenders/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to get tender details');
    return res.json();
  },

  deleteTender: async (id: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/tenders/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete tender');
    return res.json();
  },

  uploadTender: async (file: File): Promise<Tender> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE_URL}/tenders/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to upload tender');
    }
    return res.json();
  },

  // Chat with Tender
  chat: async (tenderId: number, message: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
  },

  // Upload Corrigendum
  uploadAmendment: async (tenderId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/amendment`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload amendment');
    return res.json();
  },

  // Update Checklist Document
  updateChecklist: async (tenderId: number, itemId: number, status: string, matchingVaultDoc?: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/checklist/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, matching_vault_doc: matchingVaultDoc })
    });
    if (!res.ok) throw new Error('Failed to update checklist item');
    return res.json();
  },

  // Similar Tenders
  getSimilarTenders: async (tenderId: number): Promise<SimilarTender[]> => {
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/similar`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch similar tenders');
    return res.json();
  },

  // Discovery Portal (v3.0)
  getDiscoveryTenders: async (q = '', dept = '', minVal = 0, maxVal = 10000): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/tenders/discovery?q=${encodeURIComponent(q)}&dept=${encodeURIComponent(dept)}&min_val=${minVal}&max_val=${maxVal}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch discovery list');
    return res.json();
  },

  toggleBookmark: async (tenderId: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/bookmark`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  getSavedTenders: async (): Promise<Tender[]> => {
    const res = await fetch(`${API_BASE_URL}/tenders/saved`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch bookmarked tenders');
    return res.json();
  }
};
