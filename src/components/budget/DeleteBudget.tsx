import { AlertCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Budget } from "./types";
import Modal from "../common/Modal";

interface DeleteBudgetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  budget: Budget | null;
}
const DeleteBudget: React.FC<DeleteBudgetProps> = ({ isOpen, onClose, onConfirm, budget }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    if (!budget?.id) return
    try {
      onConfirm(budget?.id);
      onClose();
    } catch (error) {
      console.error('Error deleting budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !budget) return null;

  const progress = (budget.spent / budget.amount) * 100;
  const hasTransactions = budget.spent > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Delete Budget"}>
      <div className="bg-white rounded-xl w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">{budget.category}</h3>
              <span className="text-sm text-gray-500">
                ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${progress >= 100 ? 'bg-red-500' :
                  progress >= 90 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600">
              {progress.toFixed(1)}% used
            </div>
          </div>

          {hasTransactions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Warning</h4>
                  <p className="text-yellow-700 text-sm">
                    This budget has ${budget.spent.toLocaleString()} in tracked expenses.
                    Deleting it will not affect your transaction history.
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the <strong>{budget.category}</strong> budget?
            This will permanently remove the budget limit and cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {loading ? 'Deleting...' : 'Delete Budget'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default DeleteBudget;