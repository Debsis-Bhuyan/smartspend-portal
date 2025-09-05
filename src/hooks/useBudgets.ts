import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Budget } from "@/components/budget/types";
import { useAlert } from "@/context/AlertContext";

const useBudgets = () => {
  const { getTokens } = useAuth();
  const { showError, showSuccess } = useAlert();
  const { accessToken } = useMemo(() => getTokens(), [getTokens]);

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ budgets updated:", budgets);
  }, [budgets]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Budget[]>("/budgets", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setBudgets(response.data);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch budgets", err);
      setError("Failed to fetch budgets");
    } finally {
      console.log("Budjets", budgets)
      setLoading(false);
    }
  }
  // Fetch all budgets

  // Add new budget
  const addBudget = async (budgetData: Omit<Budget, "id" | "user">) => {
    console.log(budgets)
    try {
      const response = await axiosInstance.post<Budget>("/budgets", budgetData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdBudget = response.data;
      setBudgets((prev) => [createdBudget, ...prev]);
    } catch (err) {
      console.error("Failed to create budget", err);
      setError("Failed to create budget");
    }
  };

  // Update existing budget
  const updateBudget = async (id: number, budgetData: Partial<Budget>) => {
    console.log("Budgets", budgets)

    try {
      const response = await axiosInstance.put<Budget>(`/budgets/${id}`, budgetData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updated = response.data;
      // setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      console.log(budgets)
      setBudgets((prevBudgets) => {
        const updatedBudgets = prevBudgets.map((b) =>
          Number(b.id) === Number(id) ? { ...b, ...response.data } : b
        );

        console.log("✅ Updated budgets:", updatedBudgets); // ✅ log the correct, updated list
        return updatedBudgets;
      });
      console.log("Budget updated:", updated);
      console.log("Budgets", budgets)
    } catch (err) {
      console.error("Failed to update budget", err);
      setError("Failed to update budget");
    }
  };

  // Delete a budget
  const deleteBudget = async (id: number) => {
    try {
      await axiosInstance.delete(`/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setBudgets((prev) => prev.filter((b) => b.id !== id));
      showSuccess("Successfully deleted")
      console.log(`Budget ${id} deleted`);
    } catch (err) {
      console.error(`Failed to delete budget ${id}`, err);
      showError("Failed to delete budget")
      setError("Failed to delete budget");
    }
  };

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets
  };
};

export default useBudgets;
