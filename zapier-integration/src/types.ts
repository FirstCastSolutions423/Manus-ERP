// Type definitions for Manus ERP Zapier Integration

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string | null;
  date: string;
  flagged: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: number;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  score: number;
  source: string | null;
  notes: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  notes: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  managerId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendorId: number | null;
  vendorName: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  totalAmount: number;
  orderDate: string;
  expectedDate: string | null;
  notes: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookSubscription {
  id: string;
  targetUrl: string;
  event: string;
  createdAt: string;
}

export interface ZapierBundle {
  authData: {
    access_token: string;
    refresh_token: string;
  };
  inputData: Record<string, any>;
  meta: {
    isLoadingSample?: boolean;
    isFillingDynamicDropdown?: boolean;
    isPopulatingDedupe?: boolean;
    page?: number;
    limit?: number;
  };
  subscribeData?: {
    id: string;
    target_url: string;
  };
  targetUrl?: string;
  cleanedRequest?: any;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}
