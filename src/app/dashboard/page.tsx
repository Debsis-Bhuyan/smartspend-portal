'use client'

import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import ProtectedRoute from "@/components/dashboard-layout/ProtectedRoute"
import DashboardPage from "@/components/dashboard/Dashboard"
import Head from "next/head"

const UserNotifications = () => {
    return (
        <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Dashboard" />
            </Head>
            <DashboardLayout
                title="Dashboard" subtitle="Welcome back! Here's your financial overview."
            >
                <DashboardPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
}
export default UserNotifications;