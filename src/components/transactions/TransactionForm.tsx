import { Check, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Transaction, TransactionFormData } from "./type";
import SingleSelect from "../common/SingleSelectInput";
import Modal from "../common/Modal";

interface TransactionFormProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  title: string;
}
const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSave, onCancel, isOpen, title }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    description: transaction?.description || '',
    amount: transaction ? Math.abs(transaction.amount).toString() : "",
    category: transaction?.category || '',
    type: transaction?.type || 'EXPENSE',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    notes: transaction?.notes || ''
  });

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Income', 'Investment', 'Other'
  ].map(cat => ({ id: cat, name: cat }));

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    const transactionData: Transaction = {
      ...formData,
      amount: parseFloat(formData.amount) * (formData.type === 'EXPENSE' ? -1 : 1),
      notes: formData.notes || undefined
    };

    onSave(transactionData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>

      <div className="bg-white rounded-xl max-w-4xl  p-4">
        <div className="space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Transaction Type
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                className={`flex-1 p-2 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${formData.type === 'EXPENSE'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
              >
                <TrendingDown className="w-5 h-3" />
                <span>Expense</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                className={`flex-1 p-2 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${formData.type === 'INCOME'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
              >
                <TrendingUp className="w-5 h-3" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter transaction description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>


          <SingleSelect
            label="Category *"
            options={categories}
            value={formData.category}
            onChange={(val) =>
              setFormData({ ...formData, category: val.toString() })
            }
            placeholder="Select a category"
            error={!formData.category ? "Category is required" : undefined}
          />


          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{transaction ? 'Update Transaction' : 'Add Transaction'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default TransactionForm;