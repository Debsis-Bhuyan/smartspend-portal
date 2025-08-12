import { useEffect, useState } from "react";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockTransactions = [
        { id: 1, description: 'Grocery Store', amount: -125.50, category: 'Food & Dining', type: 'expense', date: '2025-08-12', notes: 'Weekly groceries' },
        { id: 2, description: 'Salary Deposit', amount: 3500.00, category: 'Income', type: 'income', date: '2025-08-10', notes: 'Monthly salary' },
        { id: 3, description: 'Gas Station', amount: -45.20, category: 'Transportation', type: 'expense', date: '2025-08-09', notes: 'Fill up tank' },
        { id: 4, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', type: 'expense', date: '2025-08-08', notes: 'Monthly subscription' },
        { id: 5, description: 'Coffee Shop', amount: -12.75, category: 'Food & Dining', type: 'expense', date: '2025-08-07', notes: 'Morning coffee' }
      ];
      setTransactions(mockTransactions);
      setLoading(false);
    }, 500);
  }, []);

  const addTransaction = (transactionData) => {
    // TODO: Call API POST /api/transactions
    const newTransaction = {
      ...transactionData,
      id: Date.now(),
      amount: parseFloat(transactionData.amount) * (transactionData.type === 'expense' ? -1 : 1)
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id, transactionData) => {
    // TODO: Call API PUT /api/transactions/:id
    const updatedTransaction = {
      ...transactionData,
      id,
      amount: parseFloat(transactionData.amount) * (transactionData.type === 'expense' ? -1 : 1)
    };
    setTransactions(transactions.map(t => t.id === id ? updatedTransaction : t));
  };

  const deleteTransaction = (id:number) => {
    // TODO: Call API DELETE /api/transactions/:id
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
export default useTransactions;