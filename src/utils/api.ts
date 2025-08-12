import axiosInstance from "@/api/axiosInstance";

// All functions accept token as a parameter
export const getRecentTransactions = (accessToken: string) =>
  axiosInstance.get("/transactions/recent", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getBudgetSummary = (accessToken: string) =>
  axiosInstance.get("/budgets/summary", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getGoalsProgress = (accessToken: string) =>
  axiosInstance.get("/goals/progress", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUnreadNotifications = (accessToken: string) =>
  axiosInstance.get("/notifications/unread", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default axiosInstance;
