import { Calendar, IndianRupee, IndianRupeeIcon, Save, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Budget } from "./types";
import Modal from "../common/Modal";

interface EditBudgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedBudget: Budget) => void;
  budget: Budget | null;
}
interface FormErrors {
  category?: string;
  amount?: string;
  month?: string;
}
const EditBudget: React.FC<EditBudgetProps> = ({ isOpen, onClose, onSave, budget }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
    color: 'bg-blue-500',
    year: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

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
    if (isOpen && budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        month: budget.month.toString(),
        color: budget.color,
        year: budget.year.toString()
      });
    }
  }, [isOpen, budget]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category) {
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
    if (!budget?.id) return;
    setLoading(true);
    try {
      const updatedBudget = {
        ...budget,
        ...formData,
        id: budget?.id,
        month: parseFloat(formData.month),
        year: parseFloat(formData.year),
        amount: parseFloat(formData.amount)
      };
      onSave(budget?.id, updatedBudget);
      handleClose();
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !budget) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={"Edit Budget"}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category (Read-only for editing) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={16} className="inline mr-1" />
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Budget Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IndianRupee size={16} className="inline mr-1" />
              Budget Limit
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            {budget.spent > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Current spent: ${budget.spent.toLocaleString()}
              </p>
            )}
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
                <Save size={16} />
              )}
              {loading ? 'Updating...' : 'Update Budget'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditBudget;