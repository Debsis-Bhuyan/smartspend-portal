'use client'

import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import ProtectedRoute from "@/components/dashboard-layout/ProtectedRoute"
import TransactionPage from "@/components/transactions/TransactionPage"
import Head from "next/head"

const UserNotifications = () => {
    return (
        <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Head>
                <title>Transactions</title>
                <meta name="description" content="Dashboard" />
            </Head>
            <DashboardLayout
                title="Transaction" subtitle="Welcome back! Here's your financial overview."
            >
                <TransactionPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
}
export default UserNotifications;