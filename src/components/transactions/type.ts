export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string; // ISO format
  notes?: string;
}
export interface TransactionFormData {
  description: string;
  amount: string; // string for input handling
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  notes: string;
}
export interface TransactionFiltersType {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  startDate?: string; // e.g., "2025-08-13"
  endDate?: string;
  search?: string;
}

export interface TransactionFilters {
  category: string;
  type: 'INCOME' | 'EXPENSE' | '';
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}
