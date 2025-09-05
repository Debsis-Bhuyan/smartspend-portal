import { useEffect, useState } from "react";
import AddBudget from "./AddBudget";
import DeleteBudget from "./DeleteBudget";
import EditBudget from "./EditBudget";
import { Check, Edit, IndianRupee, Plus, Trash2 } from "lucide-react";
import { Budget } from "./types";
import useBudgets from "@/hooks/useBudgets";
interface BudgetManagementDemoProps {
    budgets: Budget[];
    addBudget: (budget: Budget) => void;
    updateBudget: (id: number, updatedBudget: Budget) => void;
    deleteBudget: (id: number) => void;
}
const BudgetManagementDemo: React.FC<BudgetManagementDemoProps> = ({ budgets, addBudget, updateBudget, deleteBudget }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);



    const handleAddBudget = (newBudget: Budget) => {
        const budget = {
            ...newBudget,
            id: Date.now(),
            spent: 0
        };
        addBudget(budget);
    };

    const handleEditBudget = (id: number, updatedBudget: Budget) => {
        updateBudget(id, updatedBudget);
    };

    const handleDeleteBudget = (budgetId: number) => {
        // setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
        deleteBudget(budgetId);
    };

    const openEditModal = (budget: Budget) => {
        setSelectedBudget(budget);
        setShowEditModal(true);
    };

    const openDeleteModal = (budget: Budget) => {
        setSelectedBudget(budget);
        setShowDeleteModal(true);
    };
    const handleTransaction = (budget: Budget) => {
        // Example: open a modal, redirect to a transaction page, etc.
        console.log("Make transaction for category:", budget);
        // openTransactionModal(category);
    };
    return (
        <div className="w-full" >
            <div className="p-2" >
                <div className="flex justify-between hello items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Budgets</h1>
                        <p className="text-gray-600">Track your spending limits and stay on budget</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors" >
                        <Plus size={20} />
                        Add Budget
                    </button>
                </div>

                {/* Budget List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map(budget => {
                        const progress = (10 / budget.amount) * 100;

                        return (
                            <div key={budget.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className={`${budget.color} h-2`}></div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{budget.category}</h3>
                                            <p className="text-gray-500 text-sm">
                                                {new Date(budget.month).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => openEditModal(budget)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(budget)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ₹{budget.spent.toLocaleString()}
                                            </span>
                                            <span className="text-gray-500">
                                                of ₹{budget.amount.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-300 ${progress >= 100 ? 'bg-red-500' :
                                                    progress >= 90 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            ></div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            {progress.toFixed(1)}% used
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-2 ${progress >= 100 ? 'text-red-600' :
                                        progress >= 90 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        <Check size={16} />
                                        <span className="text-sm font-medium">
                                            {progress >= 100 ? `Over by ${(budget.spent - budget.amount).toFixed(2)}` :
                                                `${(budget.amount - budget.spent).toFixed(2)} remaining`}
                                        </span>
                                    </div>
                                    <div className="flex justify-end ">

                                <button
                                    onClick={() => handleTransaction(budget)}
                                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Make Transaction
                                </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {budgets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <IndianRupee size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h3>
                        <p className="text-gray-600 mb-6">Create your first budget to start tracking your spending</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Your First Budget
                        </button>
                    </div>
                )}

                {/* Modals */}
                <AddBudget
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddBudget}
                />

                <EditBudget
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditBudget}
                    budget={selectedBudget}
                />

                <DeleteBudget
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteBudget}
                    budget={selectedBudget}
                />
            </div>
        </div>
    );
};
export default BudgetManagementDemo;