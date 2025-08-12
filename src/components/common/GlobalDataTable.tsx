import {
  AlertTriangle,
  ArrowUpDown,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Mail,
  MapPin,
  Minus,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Square,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';


export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  searchable?: boolean;
  minWidth?: string;
  maxWidth?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface TableFilter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'text' | 'number';
  options?: FilterOption[];
  placeholder?: string;
  multiple?: boolean;
}

export interface TableAction<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  disabled?: (row: T) => boolean;
}

export interface BulkAction<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (selectedRows: T[]) => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  confirmMessage?: string;
  disabled?: (selectedRows: T[]) => boolean;
}

export interface TableStats {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ExpandedRowProps<T> {
  row: T;
  onClose: () => void;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface DataTableProps<T> {
  // Data
  data: T[];
  columns: TableColumn<T>[];
  keyField: string; // Changed from keyof T to string to support nested paths
  
  // Features
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  expandable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;

  // Create/Add functionality
  creatable?: boolean;
  createLabel?: string;
  createIcon?: React.ReactNode;
  onCreateClick?: () => void;

  // Customization
  title?: string;
  subtitle?: string;
  filters?: TableFilter[];
  actions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  stats?: TableStats[];
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loading?: boolean;
  error?: string;
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  serverSide?: boolean;
  paginationInfo?: PaginationInfo;
  
  // Callbacks
  onRefresh?: () => void;
  onExport?: (filteredData: T[]) => void;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onSort?: (sortConfig: SortConfig) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  
  // Expandable row content
  ExpandedRowComponent?: React.ComponentType<ExpandedRowProps<T>>;
  
  // Styling
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  tableClassName?: string;
  
  // Search configuration
  searchPlaceholder?: string;
  searchFields?: string[]; // Changed to string[] to support nested paths
  searchDebounceMs?: number;
  
  // Filter configuration
  defaultFilters?: Record<string, any>;
  
  // Row configuration
  rowHeight?: 'compact' | 'normal' | 'comfortable';
  striped?: boolean;
  hoverable?: boolean;
  
  // Advanced features
  virtualScrolling?: boolean;
  infiniteScroll?: boolean;
  groupBy?: keyof T;
  summary?: boolean;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

const getNestedValue = (obj: any, path: string | number | symbol): any => {
  const stringPath = String(path);
  return stringPath.split('.').reduce((current, key) => current?.[key], obj);
};

const setNestedValue = (obj: any, path: string | number | symbol, value: any): any => {
  const stringPath = String(path);
  const keys = stringPath.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => current[key] = current[key] || {}, obj);
  target[lastKey] = value;
  return obj;
};

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ========================================
// COLUMN RENDERERS
// ========================================

export const ColumnRenderers = {
  // Status badge renderer
  status: (statusConfig: Record<string, { color: string; icon?: ReactNode; label?: string }>) => 
    (value: string) => {
      if (!value) return <span className="text-gray-400">-</span>;
      const config = statusConfig[value] || { color: 'gray' };
      const displayLabel = config.label || value.replace('-', ' ').replace('_', ' ').toUpperCase();
      
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-50 text-${config.color}-600 border border-${config.color}-200`}>
          {config.icon}
          {displayLabel}
        </span>
      );
    },

  // Date formatter
  date: (format: 'short' | 'long' | 'datetime' | 'time' | 'relative' = 'short') => 
    (value: string | Date) => {
      if (!value) return <span className="text-gray-400">-</span>;
      const date = new Date(value);
      
      if (isNaN(date.getTime())) return <span className="text-gray-400">Invalid Date</span>;
      
      switch (format) {
        case 'long':
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        case 'datetime':
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        case 'time':
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
        case 'relative':
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) return 'Today';
          if (diffDays === 1) return 'Yesterday';
          if (diffDays < 7) return `${diffDays} days ago`;
          if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
          if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
          return `${Math.floor(diffDays / 365)} years ago`;
        default:
          return date.toLocaleDateString('en-US');
      }
    },

  // Currency formatter (Indian Rupees)
  currency: (value: number | string, options: { currency?: string; showSymbol?: boolean } = {}) => {
    const { currency = 'INR', showSymbol = true } = options;
    
    if (value == null || value === '') return <span className="text-gray-400">-</span>;
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return <span className="text-gray-400">-</span>;
    
    const formatted = numValue.toLocaleString('en-IN', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return (
      <span className={`font-medium ${numValue < 0 ? 'text-red-600' : 'text-gray-900'}`}>
        {showSymbol && currency === 'INR' ? `₹${numValue.toLocaleString('en-IN')}` : formatted}
      </span>
    );
  },

  // Patient name with additional info
  patientInfo: (config: {
    nameField: string;
    ageField?: string;
    genderField?: string;
    uhidField?: string;
    avatarField?: string;
  }) => (value: any, row: any) => {
    const { nameField, ageField, genderField, uhidField, avatarField } = config;
    const name = getNestedValue(row, nameField);
    const age = ageField ? getNestedValue(row, ageField) : null;
    const gender = genderField ? getNestedValue(row, genderField) : null;
    const uhid = uhidField ? getNestedValue(row, uhidField) : null;
    const avatar = avatarField ? getNestedValue(row, avatarField) : null;
    
    return (
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 space-x-2">
            {age && <span>{age}y</span>}
            {gender && <span>• {gender}</span>}
            {uhid && <span>• {uhid}</span>}
          </div>
        </div>
      </div>
    );
  },

  arrayList: (config: { maxItems?: number; moreText?: string } = {}) =>
    (value: string[] | any[]) => {
      const { maxItems = 3, moreText = 'more' } = config;
      
      if (!Array.isArray(value) || value.length === 0) {
        return <span className="text-gray-400">-</span>;
      }
      
      const displayItems = value.slice(0, maxItems);
      const remaining = value.length - maxItems;
      
      return (
        <div>
          <span>{displayItems.join(', ')}</span>
          {remaining > 0 && (
            <span className="text-gray-500 ml-1">+{remaining} {moreText}</span>
          )}
        </div>
      );
    },

  // Priority/Urgency indicator
  priority: (value: string) => {
    const priorityConfig: Record<string, { color: string; icon?: ReactNode }> = {
      'Critical': { color: 'red', icon: <AlertTriangle className="w-3 h-3" /> },
      'High': { color: 'orange', icon: <AlertTriangle className="w-3 h-3" /> },
      'Emergency': { color: 'red', icon: <AlertTriangle className="w-3 h-3" /> },
      'Urgent': { color: 'orange', icon: <Clock className="w-3 h-3" /> },
      'Medium': { color: 'blue' },
      'Normal': { color: 'blue' },
      'Routine': { color: 'blue' },
      'Low': { color: 'green' },
      'Elective': { color: 'green' }
    };
    
    return ColumnRenderers.status(priorityConfig)(value);
  },

  // Boolean as Yes/No with color
  boolean: (config: { 
    trueLabel?: string; 
    falseLabel?: string; 
    trueColor?: string; 
    falseColor?: string; 
  } = {}) => (value: boolean) => {
    const { 
      trueLabel = 'Yes', 
      falseLabel = 'No', 
      trueColor = 'text-green-600', 
      falseColor = 'text-gray-500' 
    } = config;
    
    return (
      <span className={`text-sm font-medium ${value ? trueColor : falseColor}`}>
        {value ? trueLabel : falseLabel}
      </span>
    );
  },

  // Progress bar
  progress: (config: { 
    max?: number; 
    color?: string; 
    showPercentage?: boolean; 
    showLabel?: boolean;
  } = {}) => (value: number) => {
    const { max = 100, color = 'blue', showPercentage = true, showLabel = false } = config;
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="w-full">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {(showPercentage || showLabel) && (
          <div className="text-xs text-gray-600 mt-1 flex justify-between">
            {showLabel && <span>{value}/{max}</span>}
            {showPercentage && <span>{Math.round(percentage)}%</span>}
          </div>
        )}
      </div>
    );
  },

  // Badge with count
  badge: (config: { color?: string; variant?: 'solid' | 'outline' } = {}) =>
    (value: string | number) => {
      const { color = 'gray', variant = 'solid' } = config;
      
      if (!value && value !== 0) return <span className="text-gray-400">-</span>;
      
      const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
      const colorClasses = variant === 'solid'
        ? `bg-${color}-100 text-${color}-800`
        : `border border-${color}-300 text-${color}-600`;
      
      return (
        <span className={`${baseClasses} ${colorClasses}`}>
          {value}
        </span>
      );
    },

  // Truncated text with tooltip
  truncate: (config: { maxLength?: number; showTooltip?: boolean } = {}) =>
    (value: string) => {
      const { maxLength = 50, showTooltip = true } = config;
      
      if (!value) return <span className="text-gray-400">-</span>;
      
      if (value.length <= maxLength) return <span>{value}</span>;
      
      const truncated = `${value.substring(0, maxLength)}...`;
      
      if (showTooltip) {
        return (
          <span title={value} className="cursor-help">
            {truncated}
          </span>
        );
      }
      
      return <span>{truncated}</span>;
    }
};

// ========================================
// CUSTOM HOOKS
// ========================================

export const useTableData = <T,>(initialData: T[]) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (fetchFn?: () => Promise<T[]>) => {
    if (!fetchFn) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newData = await fetchFn();
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (keyField: string, key: any, updates: Partial<T>) => {
    setData(prev => prev.map(row => 
      getNestedValue(row, keyField) === key 
        ? { ...row, ...updates }
        : row
    ));
  };

  const addRow = (newRow: T) => {
    setData(prev => [newRow, ...prev]);
  };

  const removeRow = (keyField: string, key: any) => {
    setData(prev => prev.filter(row => getNestedValue(row, keyField) !== key));
  };

  const removeRows = (keyField: string, keys: any[]) => {
    setData(prev => prev.filter(row => !keys.includes(getNestedValue(row, keyField))));
  };

  return {
    data,
    setData,
    loading,
    error,
    refresh,
    updateRow,
    addRow,
    removeRow,
    removeRows
  };
};

// ========================================
// MAIN DATATABLE COMPONENT
// ========================================

export const GlobalDataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  expandable = false,
  exportable = false,
  refreshable = false,
  title,
  subtitle,
  filters = [],
  actions = [],
  bulkActions = [],
  stats = [],
  emptyMessage = "No data available",
  emptyIcon,
  loading = false,
  error,
  pagination = true,
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  serverSide = false,
  paginationInfo,
  onRefresh,
  onExport,
  onRowClick,
  onSelectionChange,
  onSort,
  onFilter,
  onPageChange,
  ExpandedRowComponent,
  className = "",
  headerClassName = "",
  rowClassName = "",
  tableClassName = "",
  searchPlaceholder = "Search...",
  searchFields,
  searchDebounceMs = 300,
  defaultFilters = {},
  rowHeight = 'normal',
  striped = false,
  hoverable = true,
  creatable = false,
  createLabel = "Add New",
  createIcon = <Plus className="w-4 h-4" />,
  onCreateClick = () => {},

}: DataTableProps<T>) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<any>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(defaultFilters);

  // Debounced search
  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), searchDebounceMs),
    [searchDebounceMs]
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Computed values
  const filteredAndSortedData = useMemo(() => {
    if (serverSide) return data; // Server handles filtering/sorting
    
    let result = [...data];

    // Apply search
    if (debouncedSearchTerm && searchable) {
      const searchableColumns = searchFields || columns
        .filter(col => col.searchable !== false)
        .map(col => col.key);
      
      result = result.filter(row =>
        searchableColumns.some(field => {
          const value = getNestedValue(row, field);
          return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue && filterValue !== 'all' && filterValue !== '') {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          result = result.filter(row => {
            const value = getNestedValue(row, filterKey);
            return filterValue.includes(value);
          });
        } else {
          result = result.filter(row => {
            const value = getNestedValue(row, filterKey);
            if (typeof filterValue === 'string' && filterValue.toLowerCase() === 'true') {
              return value === true;
            }
            if (typeof filterValue === 'string' && filterValue.toLowerCase() === 'false') {
              return value === false;
            }
            return value === filterValue;
          });
        }
      }
    });

    // Apply sorting
    if (sortConfig.key && sortable) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);
        
        // Handle different data types
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === 'asc' 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || '').toLowerCase();
        const bStr = String(bValue || '').toLowerCase();
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, debouncedSearchTerm, activeFilters, sortConfig, searchable, sortable, columns, searchFields, serverSide]);

  // Pagination
  const totalItems = serverSide && paginationInfo ? paginationInfo.totalItems : filteredAndSortedData.length;
  const totalPages = serverSide && paginationInfo ? paginationInfo.totalPages : Math.ceil(totalItems / currentPageSize);
  
  const paginatedData = useMemo(() => {
    if (serverSide) return data; // Server handles pagination
    if (!pagination) return filteredAndSortedData;
    
    const startIndex = (currentPage - 1) * currentPageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + currentPageSize);
  }, [filteredAndSortedData, currentPage, currentPageSize, pagination, serverSide, data]);

  // Selection helpers
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(getNestedValue(row, String(keyField))));
  const isSomeSelected = paginatedData.some(row => selectedRows.has(getNestedValue(row, String(keyField))));

  // Handlers
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    const newSortConfig = {
      key: columnKey,
      direction: (sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc'
    };
    
    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = new Set(selectedRows);
    
    if (checked) {
      paginatedData.forEach(row => newSelection.add(getNestedValue(row, String(keyField))));
    } else {
      paginatedData.forEach(row => newSelection.delete(getNestedValue(row, String(keyField))));
    }
    
    setSelectedRows(newSelection);
    
    const selectedData = data.filter(row => newSelection.has(getNestedValue(row, String(keyField))));
    onSelectionChange?.(selectedData);
  };

  const handleSelectRow = (rowKey: any) => {
    const newSelection = new Set(selectedRows);
    
    if (newSelection.has(rowKey)) {
      newSelection.delete(rowKey);
    } else {
      newSelection.add(rowKey);
    }
    
    setSelectedRows(newSelection);
    
    const selectedData = data.filter(row => newSelection.has(getNestedValue(row, String(keyField))));
    onSelectionChange?.(selectedData);
  };

  const handleExpandRow = (rowKey: any) => {
    const newExpanded = new Set(expandedRows);
    
    if (newExpanded.has(rowKey)) {
      newExpanded.delete(rowKey);
    } else {
      newExpanded.add(rowKey);
    }
    
    setExpandedRows(newExpanded);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value
    };
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setCurrentPage(1);
    onFilter?.({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page, currentPageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
    onPageChange?.(1, size);
  };

  const handleExport = () => {
    onExport?.(serverSide ? data : filteredAndSortedData);
  };

  const handleBulkAction = (action: BulkAction<T>) => {
    const selectedData = data.filter(row => selectedRows.has(getNestedValue(row, String(keyField))));
    
    if (action.disabled?.(selectedData)) return;
    
    if (action.confirmMessage) {
      if (window.confirm(action.confirmMessage)) {
        action.onClick(selectedData);
      }
    } else {
      action.onClick(selectedData);
    }
  };

  // Reset selection when page changes (optional)
  useEffect(() => {
    if (!serverSide) {
      setSelectedRows(new Set());
    }
  }, [currentPage, serverSide]);

  // Utility functions for styling
  const getActionButtonClass = (color: string = 'primary', size: string = 'md') => {
    const baseClass = size === 'sm' ? 'p-1' : 'p-2';
    const colorClasses = {
      primary: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
      secondary: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
      success: 'text-green-600 hover:text-green-800 hover:bg-green-50',
      warning: 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50',
      danger: 'text-red-600 hover:text-red-800 hover:bg-red-50'
    };
    
    return `${baseClass} rounded transition-colors ${colorClasses[color as keyof typeof colorClasses]} disabled:opacity-50 disabled:cursor-not-allowed`;
  };

  const getBulkActionClass = (color: string = 'primary') => {
    const colorClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    
    return `px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  const getRowClasses = (row: T, index: number) => {
    const baseClasses = [
      rowHeight === 'compact' ? 'h-10' : rowHeight === 'comfortable' ? 'h-16' : 'h-12',
      hoverable ? 'hover:bg-gray-50' : '',
      striped && index % 2 === 1 ? 'bg-gray-25' : '',
      onRowClick ? 'cursor-pointer' : '',
                        selectedRows.has(getNestedValue(row, String(keyField))) ? 'bg-blue-50 border-l-2 border-blue-500' : ''
    ];
    
    const customClass = typeof rowClassName === 'function' 
      ? rowClassName(row, index) 
      : rowClassName;
    
    return [...baseClasses, customClass].filter(Boolean).join(' ');
  };

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-gray-500 mt-1">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Section */}
      {stats.length > 0 && (
        <div className={`grid gap-4 ${
          stats.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          stats.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          stats.length === 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' :
          stats.length === 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
          stats.length === 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend && (
                      <span className={`text-xs flex items-center ${
                        stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 mr-1 ${!stat.trend.isPositive ? 'rotate-180' : ''}`} />
                        {Math.abs(stat.trend.value)}%
                      </span>
                    )}
                  </div>
                  {stat.subtext && (
                    <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                  )}
                </div>
                {stat.icon && (
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    stat.color === 'success' ? 'bg-green-100 text-green-600' :
                    stat.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    stat.color === 'danger' ? 'bg-red-100 text-red-600' :
                    stat.color === 'secondary' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {stat.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header Section with Title */}
      {(title || subtitle) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            {searchable && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {filterable && filters.length > 0 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              )}
              
              {refreshable && onRefresh && (
                <button
                  onClick={onRefresh}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              
              {exportable && onExport && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
              {creatable && onCreateClick && (
                <button
                  onClick={onCreateClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {createIcon || <Plus className="w-4 h-4" />}
                  {createLabel}
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && filterable && filters.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className={`grid gap-4 ${
                filters.length === 1 ? 'grid-cols-1 max-w-xs' :
                filters.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                filters.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                filters.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                filters.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
                filters.length === 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {filter.label}
                    </label>
                    {filter.type === 'select' && (
                      <select
                        value={activeFilters[filter.key] || 'all'}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All</option>
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} {option.count ? `(${option.count})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                    {filter.type === 'multiselect' && (
                      <select
                        multiple
                        value={activeFilters[filter.key] || []}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value);
                          handleFilterChange(filter.key, values);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} {option.count ? `(${option.count})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                    {filter.type === 'text' && (
                      <input
                        type="text"
                        placeholder={filter.placeholder}
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    {filter.type === 'number' && (
                      <input
                        type="number"
                        placeholder={filter.placeholder}
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    {filter.type === 'daterange' && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={activeFilters[`${filter.key}_start`] || ''}
                          onChange={(e) => handleFilterChange(`${filter.key}_start`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="date"
                          value={activeFilters[`${filter.key}_end`] || ''}
                          onChange={(e) => handleFilterChange(`${filter.key}_end`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
          <div className="p-4 bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                {bulkActions.map((action) => {
                  const selectedData = data.filter(row => selectedRows.has(getNestedValue(row, String(keyField))));
                  const isDisabled = action.disabled?.(selectedData);
                  
                  return (
                    <button
                      key={action.key}
                      onClick={() => handleBulkAction(action)}
                      disabled={isDisabled}
                      className={getBulkActionClass(action.color)}
                    >
                      {action.icon && <span className="mr-1">{action.icon}</span>}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${tableClassName}`}>
            <thead className={`bg-gray-50 border-b ${headerClassName}`}>
              <tr>
                {selectable && (
                  <th className="px-4 py-3 text-left w-12">
                    <div className="flex items-center">
                      {isAllSelected ? (
                        <CheckSquare
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                          onClick={() => handleSelectAll(false)}
                        />
                      ) : isSomeSelected ? (
                        <Minus
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                          onClick={() => handleSelectAll(false)}
                        />
                      ) : (
                        <Square
                          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                          onClick={() => handleSelectAll(true)}
                        />
                      )}
                    </div>
                  </th>
                )}
                
                {expandable && <th className="px-4 py-3 w-12"></th>}
                
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-${column.align || 'left'} ${column.width || ''} ${
                      column.minWidth ? `min-w-[${column.minWidth}]` : ''
                    } ${column.maxWidth ? `max-w-[${column.maxWidth}]` : ''} ${
                      column.sticky ? 'sticky left-0 bg-gray-50 z-10' : ''
                    }`}
                  >
                    {column.sortable && sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 group"
                      >
                        {column.label}
                        <ArrowUpDown className={`w-3 h-3 transition-colors ${
                          sortConfig.key === column.key ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-gray-700">{column.label}</span>
                    )}
                  </th>
                ))}
                
                {actions.length > 0 && (
                  <th className="px-4 py-3 text-left w-32">
                    <span className="text-sm font-medium text-gray-700">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      {emptyIcon || <Users className="w-12 h-12 text-gray-300 mb-4" />}
                      <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
                      {(searchTerm || Object.keys(activeFilters).length > 0) && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const rowKey = getNestedValue(row, String(keyField));
                  const isSelected = selectedRows.has(rowKey);
                  const isExpanded = expandedRows.has(rowKey);

                  return (
                    <React.Fragment key={rowKey}>
                      <tr 
                        className={getRowClasses(row, index)}
                        onClick={() => onRowClick?.(row)}
                      >
                        {selectable && (
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            {isSelected ? (
                              <CheckSquare
                                className="w-4 h-4 text-blue-600 cursor-pointer"
                                onClick={() => handleSelectRow(rowKey)}
                              />
                            ) : (
                              <Square
                                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => handleSelectRow(rowKey)}
                              />
                            )}
                          </td>
                        )}
                        
                        {expandable && (
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleExpandRow(rowKey)}
                              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        )}
                        
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className={`px-4 py-3 text-${column.align || 'left'} ${
                              column.sticky ? 'sticky left-0 bg-white z-10' : ''
                            }`}
                          >
                            <div className={column.maxWidth ? 'truncate' : ''}>
                              {column.render 
                                ? column.render(getNestedValue(row, column.key), row, index)
                                : getNestedValue(row, column.key) || <span className="text-gray-400">-</span>
                              }
                            </div>
                          </td>
                        ))}
                        
                        {actions.length > 0 && (
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {actions
                                .filter(action => !action.show || action.show(row))
                                .map((action) => {
                                  const isDisabled = action.disabled?.(row);
                                  
                                  return (
                                    <button
                                      key={action.key}
                                      onClick={() => !isDisabled && action.onClick(row)}
                                      disabled={isDisabled}
                                      className={getActionButtonClass(action.color, action.size)}
                                      title={action.label}
                                    >
                                      {action.icon || <MoreHorizontal className="w-4 h-4" />}
                                    </button>
                                  );
                                })
                              }
                            </div>
                          </td>
                        )}
                      </tr>
                      
                      {/* Expanded Row */}
                      {isExpanded && ExpandedRowComponent && (
                        <tr>
                          <td
                            colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                            className="px-4 py-4 bg-gray-50 border-t"
                          >
                            <ExpandedRowComponent 
                              row={row} 
                              onClose={() => handleExpandRow(rowKey)} 
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalItems > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * currentPageSize + 1, totalItems)} to{' '}
                  {Math.min(currentPage * currentPageSize, totalItems)} of{' '}
                  {totalItems.toLocaleString()} entries
                  {!serverSide && totalItems !== data.length && (
                    <span className="text-gray-500"> (filtered from {data.length.toLocaleString()} total)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Show:</label>
                  <select
                    value={currentPageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-700">per page</span>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="ellipsis1" className="px-2 py-1 text-sm text-gray-500">...</span>);
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            i === currentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2 py-1 text-sm text-gray-500">...</span>);
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// ========================================
// UTILITY COMPONENTS
// ========================================

export const EmptyState: React.FC<{
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center py-12">
    {icon && <div className="mb-4">{icon}</div>}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-500 text-center mb-4">{description}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

export const LoadingState: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center py-12">
    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
    <p className="text-gray-500">{message}</p>
  </div>
);

export const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center py-12">
    <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
    <p className="text-red-600 text-center mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// ========================================
// ADVANCED FEATURES & EXTENSIONS
// ========================================

// Virtual scrolling hook for large datasets
export const useVirtualScrolling = <T,>(
  data: T[],
  containerHeight: number,
  itemHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, data.length);
  
  const visibleData = data.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleData,
    startIndex,
    endIndex,
    offsetY,
    totalHeight: data.length * itemHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};

// Column visibility management
export const useColumnVisibility = <T,>(columns: TableColumn<T>[]) => {
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col.key));
  
  const toggleColumn = (columnKey: string) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };
  
  const showAllColumns = () => setHiddenColumns(new Set());
  const hideColumn = (columnKey: string) => {
    setHiddenColumns(prev => new Set([...Array.from(prev), columnKey]));
  };
  
  return {
    visibleColumns,
    hiddenColumns,
    toggleColumn,
    showAllColumns,
    hideColumn
  };
};

// Table state persistence
export const useTableState = (tableId: string) => {
  const getStoredState = () => {
    try {
      const stored = localStorage.getItem(`table-state-${tableId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };
  
  const [state, setState] = useState(getStoredState);
  
  const updateState = (updates: Partial<any>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    try {
      localStorage.setItem(`table-state-${tableId}`, JSON.stringify(newState));
    } catch {
      // Silently fail if localStorage is not available
    }
  };
  
  const resetState = () => {
    setState({});
    try {
      localStorage.removeItem(`table-state-${tableId}`);
    } catch {
      // Silently fail if localStorage is not available
    }
  };
  
  return { state, updateState, resetState };
};

// Column resizing hook
export const useColumnResizing = <T,>(columns: TableColumn<T>[]) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isResizing, setIsResizing] = useState<string | null>(null);
  
  const startResize = (columnKey: string) => {
    setIsResizing(columnKey);
  };
  
  const handleResize = (columnKey: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: Math.max(width, 100) // Minimum width of 100px
    }));
  };
  
  const stopResize = () => {
    setIsResizing(null);
  };
  
  const resetWidths = () => {
    setColumnWidths({});
  };
  
  return {
    columnWidths,
    isResizing,
    startResize,
    handleResize,
    stopResize,
    resetWidths
  };
};

// Data export utilities
export const exportToCSV = <T,>(data: T[], filename: string, columns?: TableColumn<T>[]) => {
  const headers = columns ? columns.map(col => col.label) : Object.keys(data[0] || {});
  const keys = columns ? columns.map(col => col.key) : Object.keys(data[0] || {});
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      keys.map(key => {
        const value = getNestedValue(row, key);
        const stringValue = String(value || '');
        // Escape commas and quotes
        return stringValue.includes(',') || stringValue.includes('"') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToJSON = <T,>(data: T[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const printTable = <T,>(data: T[], columns: TableColumn<T>[], title?: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const headers = columns.map(col => col.label);
  const keys = columns.map(col => col.key);
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Table Data'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          h1 { color: #333; margin-bottom: 20px; }
          .print-date { color: #666; font-size: 12px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${title ? `<h1>${title}</h1>` : ''}
        <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${keys.map(key => `<td>${getNestedValue(row, key) || '-'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

export default GlobalDataTable;