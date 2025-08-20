import { Transaction } from "@/components/transactions/type";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import axiosInstance from '../api/axiosInstance';

const useTransactions = () => {
  const { getTokens } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = getTokens();
  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/transactions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });

        const fetchedTransactions: Transaction[] = response.data;

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
        // Optional: show UI error
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const now = new Date();
  console.log(transactions)
  const formattedDate = now.toISOString().split('T')[0]; // "YYYY-MM-DD" format

  const addTransaction = async (transactionData: Transaction) => {
    try {
      const response = await axiosInstance.post("/transactions", {
        ...transactionData,
        amount: parseFloat(transactionData.amount.toString()) *
          (transactionData.type === 'EXPENSE' ? -1 : 1),
        type: transactionData.type.toUpperCase(),
        date: formattedDate

      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const createdTransaction: Transaction = response.data;

      // Update local state with the newly created transaction from server
      setTransactions((prev) => [createdTransaction, ...prev]);

      console.log("Transaction created:", createdTransaction);
    } catch (error) {
      console.error("Failed to create transaction", error);
      // Optional: show UI error notification here
    }
  };
  const updateTransaction = async (id: string, transactionData: Transaction) => {
    try {
      const response = await axiosInstance.put(`/transactions/${id}`, {
        ...transactionData,
        amount: parseFloat(transactionData.amount.toString()) *
          (transactionData.type === 'EXPENSE' ? -1 : 1),
        type: transactionData.type.toUpperCase()
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const updatedTransaction: Transaction = response.data;

      // Update local state
      setTransactions(prev =>
        prev.map(t => t.id === id ? updatedTransaction : t)
      );

      console.log("Transaction updated:", updatedTransaction);
    } catch (error) {
      console.error("Failed to update transaction", error);
      // Optional: handle UI error
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axiosInstance.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      // If delete successful, update local state
      setTransactions(prev => prev.filter(t => t.id !== id));
      console.log(`Transaction ${id} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete transaction ${id}`, error);
      // Optional: show user-facing error
    }
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