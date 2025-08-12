'use client'

import DashboardLayout from '@/components/dashboard-layout/DashboardLayout'
import ProtectedRoute from '@/components/dashboard-layout/ProtectedRoute'
import Head from 'next/head'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'user']}>
      <Head>
        <title>Lab Management System - Healthcare System</title>
        <meta name="description" content="Manage lab orders, sample tracking, test processing, and result reporting" />
      </Head>
      <DashboardLayout
        title="Smart Spend" subtitle="User portal"
      >

        <div>page</div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default page