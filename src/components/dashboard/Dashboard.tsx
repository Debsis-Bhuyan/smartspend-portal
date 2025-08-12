import React, { useState, useEffect, FormEvent } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Target,
    Bell,
    Plus,
    CreditCard,
    PieChart,
    ArrowRight,
    Calendar,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';
import { getRecentTransactions, getBudgetSummary, getGoalsProgress, getUnreadNotifications } from "@/utils/api";
import { useAuth } from '@/context/AuthContext';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'expense' | 'income';
}

interface Budget {
    id: number;
    category: string;
    spent: number;
    budget: number;
    percentage: number;
}

interface Goal {
    id: number;
    name: string;
    target: number;
    saved: number;
    percentage: number;
}

interface NewTransaction {
    amount: string;
    description: string;
    category: string;
    type: 'expense' | 'income';
}
const DashboardPage = () => {
    const { getTokens } = useAuth();
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [budgetSummary, setBudgetSummary] = useState<Budget[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false);
    const [newTransaction, setNewTransaction] = useState<NewTransaction>({
        amount: '',
        description: '',
        category: '',
        type: 'expense',
    });
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { accessToken } = await getTokens();
                if (!accessToken) {
                    throw new Error("No access token available");
                }

                const [tx, bgt, gl, ntf] = await Promise.all([
                    getRecentTransactions(accessToken),
                    getBudgetSummary(accessToken),
                    getGoalsProgress(accessToken),
                    getUnreadNotifications(accessToken)
                ]);

                setRecentTransactions(tx.data);
                setBudgetSummary(bgt.data);
                setGoals(gl.data);
                setNotifications(ntf.data);
            } catch (error) {
                console.error("Dashboard data fetch failed:", error);
            }
        };

        fetchDashboardData();
    }, []);
    // Mock data - replace with actual API calls
    useEffect(() => {
        // Mock recent transactions
        setRecentTransactions([
            { id: 1, description: 'Grocery Store', amount: -85.50, category: 'Food', date: '2025-08-12', type: 'expense' },
            { id: 2, description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: '2025-08-10', type: 'income' },
            { id: 3, description: 'Gas Station', amount: -45.20, category: 'Transportation', date: '2025-08-09', type: 'expense' },
            { id: 4, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2025-08-08', type: 'expense' },
            { id: 5, description: 'Coffee Shop', amount: -12.75, category: 'Food', date: '2025-08-07', type: 'expense' }
        ]);

        // Mock budget summary
        setBudgetSummary([
            { id: 1, category: 'Food', spent: 420, budget: 600, percentage: 70 },
            { id: 2, category: 'Transportation', spent: 280, budget: 300, percentage: 93 },
            { id: 3, category: 'Entertainment', spent: 95, budget: 200, percentage: 48 },
            { id: 4, category: 'Utilities', spent: 180, budget: 250, percentage: 72 }
        ]);

        // Mock goals
        setGoals([
            { id: 1, name: 'Emergency Fund', target: 5000, saved: 3200, percentage: 64 },
            { id: 2, name: 'Vacation', target: 2000, saved: 850, percentage: 43 },
            { id: 3, name: 'New Laptop', target: 1500, saved: 1200, percentage: 80 }
        ]);

        // Mock notifications
        setNotifications([
            {
                id: 1,
                title: 'Budget Alert',
                message: 'Transportation budget is 93% used',
                read: false,
                timestamp: '2025-08-12T10:00:00Z',  // ISO 8601 format date/time
            },
            {
                id: 2,
                title: 'Goal Update',
                message: 'Goal "New Laptop" is almost complete!',
                read: true,
                timestamp: '2025-08-11T09:00:00Z',
            },
            {
                id: 3,
                title: 'Subscription Reminder',
                message: 'Netflix subscription due tomorrow',
                read: false,
                timestamp: '2025-08-11T12:00:00Z',
            },
        ]);

    }, []);

    const getBudgetColor = (percentage: number): string => {
        if (percentage < 70) return 'bg-green-500';
        if (percentage < 90) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const handleAddTransaction = (e?: FormEvent) => {
        e && e.preventDefault();
        // TODO: Call API POST /api/transactions
        const transaction = {
            id: Date.now(),
            ...newTransaction,
            amount: parseFloat(newTransaction.amount) * (newTransaction.type === 'expense' ? -1 : 1),
            date: new Date().toISOString().split('T')[0]
        };

        setRecentTransactions([transaction, ...recentTransactions.slice(0, 4)]);
        setNewTransaction({ amount: '', description: '', category: '', type: 'expense' });
        setShowAddTransaction(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-6">
            <div className="max-w-8xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                                <p className="text-2xl font-bold text-gray-900">$8,420.50</p>
                                <p className="text-sm text-green-600 flex items-center mt-1">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    +12.5%
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
                                <p className="text-2xl font-bold text-gray-900">$3,500.00</p>
                                <p className="text-sm text-green-600 flex items-center mt-1">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    This month
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
                                <p className="text-2xl font-bold text-gray-900">$1,850.75</p>
                                <p className="text-sm text-red-600 flex items-center mt-1">
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                    This month
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
                                <p className="text-sm text-blue-600 flex items-center mt-1">
                                    <Target className="w-4 h-4 mr-1" />
                                    In progress
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                                    <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
                                        View All
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    <CreditCard className={`w-4 h-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{transaction.description}</p>
                                                    <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                                                </div>
                                            </div>
                                            <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${Math.abs(transaction.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
                                    <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
                                        Manage Budget
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {budgetSummary.map((budget, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">{budget.category}</span>
                                                <span className="text-sm text-gray-600">
                                                    ${budget.spent} / ${budget.budget}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getBudgetColor(budget.percentage)}`}
                                                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{budget.percentage}% used</span>
                                                <span>${budget.budget - budget.spent} remaining</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Notifications */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                                    <div className="flex items-center">
                                        <Bell className="w-5 h-5 text-gray-400 mr-2" />
                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                            {notifications.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className={`p-1 rounded-full mt-1 ${notification.read === false ? 'bg-yellow-100' :
                                                notification.read === true ? 'bg-green-100' : 'bg-blue-100'
                                                }`}>
                                                {notification.read === false ? (
                                                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                                                ) : notification.read === true ? (
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                ) : (
                                                    <Bell className="w-3 h-3 text-blue-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900">{notification.message}</p>
                                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {notification.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Goals Widget */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Goals Progress</h2>
                                    <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
                                        View All
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {goals.map((goal) => (
                                        <div key={goal.id} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">{goal.name}</span>
                                                <span className="text-sm text-gray-600">{goal.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 bg-blue-500 rounded-full"
                                                    style={{ width: `${goal.percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>${goal.saved.toLocaleString()}</span>
                                                <span>${goal.target.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Add Transaction Button */}
                <button
                    onClick={() => setShowAddTransaction(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors z-50"
                >
                    <Plus className="w-6 h-6" />
                </button>

                {/* Add Transaction Modal */}
                {showAddTransaction && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">Add Transaction</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={newTransaction.type}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'expense' | 'income' })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newTransaction.amount}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Transaction description"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={newTransaction.category}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Food">Food</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Income">Income</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddTransaction(false)}
                                        className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddTransaction}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add Transaction
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;