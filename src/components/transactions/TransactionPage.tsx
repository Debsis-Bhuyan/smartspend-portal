import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X,
} from 'lucide-react';
import useTransactions from '@/hooks/useTransactions';
import TransactionForm from './TransactionForm';
import TransactionsTable from './TransactionsTable';
import Pagination from './Pagination';
import SearchAndFilters from './SearchAndFilters';

const TransactionsModule = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '', type: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || transaction.category === filters.category;
    const matchesType = !filters.type || transaction.type === filters.type;
    
    const matchesDateFrom = !filters.dateFrom || new Date(transaction.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(transaction.date) <= new Date(filters.dateTo);
    
    const matchesAmountMin = !filters.amountMin || Math.abs(transaction.amount) >= parseFloat(filters.amountMin);
    const matchesAmountMax = !filters.amountMax || Math.abs(transaction.amount) <= parseFloat(filters.amountMax);

    return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handlers
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setCurrentView('edit');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleSave = (formData) => {
    if (currentView === 'edit') {
      updateTransaction(selectedTransaction.id, formData);
    } else {
      addTransaction(formData);
    }
    setCurrentView('list');
    setSelectedTransaction(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedTransaction(null);
  };

  const handleExport = (format) => {
    // TODO: Call API GET /api/transactions/export?format=csv/pdf
    const queryParams = new URLSearchParams({
      format,
      ...filters,
      search: searchTerm
    });
    alert(`Exporting ${filteredTransactions.length} transactions as ${format.toUpperCase()}...`);
    console.log(`API Call: /api/transactions/export?${queryParams}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // Form views (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {currentView === 'edit' ? 'Edit Transaction' : 'Add New Transaction'}
              </h1>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <TransactionForm
            transaction={selectedTransaction}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  // List view (default)
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <button
              onClick={() => setCurrentView('add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>

          {/* Search and Filter Component */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total: 
              <span className="font-semibold ml-1">
                ${Math.abs(filteredTransactions.reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsTable
          transactions={currentTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TransactionsModule;