import React from 'react';
import {
  Plus, Edit, Trash2, AlertTriangle, DollarSign, Calendar, TrendingUp, TrendingDown
} from 'lucide-react';

import useBudgets from '@/hooks/useBudgets';
import BudgetManagementDemo from './BudgetManagement';
import { Budget } from './types';

const BudgetList = () => {
  const { budgets, loading, error, deleteBudget, fetchBudgets, addBudget, updateBudget } = useBudgets();

  React.useEffect(() => { fetchBudgets() }, [])

  const calculateProgress = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusInfo = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    const remaining = limit - spent;

    if (percentage >= 100) {
      return {
        status: 'over',
        message: `Over budget by $${Math.abs(remaining).toFixed(2)}`,
        icon: TrendingUp,
        textColor: 'text-red-600'
      };
    } else if (percentage >= 90) {
      return {
        status: 'warning',
        message: `$${remaining.toFixed(2)} remaining`,
        icon: AlertTriangle,
        textColor: 'text-yellow-600'
      };
    } else {
      return {
        status: 'good',
        message: `$${remaining.toFixed(2)} remaining`,
        icon: TrendingDown,
        textColor: 'text-green-600'
      };
    }
  };

  const handleDeleteBudget = async (id: number) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  const formatMonthYear = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
  };

  // Temporary dummy spent values — replace with real calculations if you integrate transactions
  const getSpentForBudget = (budget: Budget) => {
    return Math.floor(Math.random() * budget.amount); // simulate
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading budgets...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">


        {/* Alerts */}
        {budgets.some(b => getSpentForBudget(b) / b.amount >= 0.9) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle size={20} className="text-red-500" />
              <span className="font-medium">Budget Alert!</span>
            </div>
            <p className="text-red-700 mt-1">
              You have {
                budgets.filter(b => getSpentForBudget(b) / b.amount >= 0.9).length
              } budget(s) at or over 90% usage.
            </p>
          </div>
        )}


        <BudgetManagementDemo
          budgets={budgets}
          addBudget={addBudget}
          updateBudget={updateBudget}
          deleteBudget={deleteBudget} />
      </div>
    </div>
  );
};

export default BudgetList;
