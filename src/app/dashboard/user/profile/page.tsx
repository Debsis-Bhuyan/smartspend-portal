'use client'

import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import ProtectedRoute from "@/components/dashboard-layout/ProtectedRoute"
import ProfilePage from "@/components/dashboard/auth/ProfilePage"
import Head from "next/head"

const UserProfilePage = () => {
    return (
        <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Head>
                <title>Lab Management System - Healthcare System</title>
                <meta name="description" content="Manage lab orders, sample tracking, test processing, and result reporting" />
            </Head>
            <DashboardLayout
                title="Smart Spend" subtitle="User portal"
            >

                <ProfilePage />
            </DashboardLayout>
        </ProtectedRoute>
    )
}
export default UserProfilePage;