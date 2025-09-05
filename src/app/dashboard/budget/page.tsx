'use client'

import React from 'react'
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import ProtectedRoute from "@/components/dashboard-layout/ProtectedRoute"
import NotificationsPage from "@/components/dashboard/notifications/NotificationsPage"
import Head from "next/head"
import BudgetList from '@/components/budget/BudgetPage'

const UserBudget = () => {
    return (
        <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Head>
                <title>Notifications</title>
                <meta name="description" content="Manage Notifications" />
            </Head>
            <DashboardLayout
                title="Smart Spend" subtitle="User Notifications"
            >
                <BudgetList />
            </DashboardLayout>
        </ProtectedRoute>
    )
}

export default UserBudget
