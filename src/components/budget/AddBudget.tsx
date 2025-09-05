import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Edit, Trash2, Calendar, DollarSign, Tag, AlertCircle, Check } from 'lucide-react';
import { Budget } from './types';
import Modal from '../common/Modal';

interface AddBudgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBudget: Budget) => void;
}
const AddBudget: React.FC<AddBudgetProps> = ({ isOpen, onClose, onSave }) => {
  const date = new Date()
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
    spent: 0,
    year: date.getFullYear(),
    color: 'bg-blue-500'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const predefinedCategories = [
    'Food', 'Transportation', 'Entertainment', 'Shopping', 'Rent',
    'Utilities', 'Healthcare', 'Travel', 'Education', 'Savings'
  ];

  const colorOptions = [
    { value: 'bg-blue-500', name: 'Blue', class: 'bg-blue-500' },
    { value: 'bg-green-500', name: 'Green', class: 'bg-green-500' },
    { value: 'bg-purple-500', name: 'Purple', class: 'bg-purple-500' },
    { value: 'bg-red-500', name: 'Red', class: 'bg-red-500' },
    { value: 'bg-yellow-500', name: 'Yellow', class: 'bg-yellow-500' },
    { value: 'bg-pink-500', name: 'Pink', class: 'bg-pink-500' },
    { value: 'bg-indigo-500', name: 'Indigo', class: 'bg-indigo-500' },
    { value: 'bg-orange-500', name: 'Orange', class: 'bg-orange-500' }
  ];

  useEffect(() => {
    if (isOpen) {
      // Set default dates (current month)
      const now = new Date();

      setFormData(prev => ({
        ...prev,
      }));
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category && !customCategory) {
      newErrors.category = 'Category is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid budget limit';
    }
    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const budgetData = {
        ...formData,
        month: 8,
        category: showCustomCategory ? customCategory : formData.category,
        amount: parseFloat(formData.amount)
      };
      console.log(budgetData)
      await onSave(budgetData);
      handleClose();
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      category: '',
      amount: '',
      month: '',
      year: date.getFullYear(),
      color: 'bg-blue-500',
      spent: 0,

    });
    setCustomCategory('');
    setShowCustomCategory(false);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={"Add New Budget"}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={16} className="inline mr-1" />
              Category
            </label>
            {!showCustomCategory ? (
              <div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select a category</option>
                  {predefinedCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  + Add custom category
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 mt-1"
                >
                  ← Back to predefined categories
                </button>
              </div>
            )}
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Budget Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Budget Limit
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.limit && <p className="text-red-500 text-sm mt-1">{errors.limit}</p>}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.month ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${formData.color === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddBudget;