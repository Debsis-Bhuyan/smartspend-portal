'use client'

import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import ProtectedRoute from "@/components/dashboard-layout/ProtectedRoute"
import NotificationsPage from "@/components/dashboard/notifications/NotificationsPage"
import Head from "next/head"

const UserNotifications = () => {
    return (
        <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Head>
                <title>Notifications</title>
                <meta name="description" content="Manage Notifications" />
            </Head>
            <DashboardLayout
                title="Smart Spend" subtitle="User Notifications"
            >
                <NotificationsPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
}
export default UserNotifications;