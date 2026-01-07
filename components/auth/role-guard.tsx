"use client"

import React from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { UserRole } from '@/lib/types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated || !user) {
        return null;
    }

    if (allowedRoles.includes(user.role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}

export function useHasRole(roles: UserRole[]) {
    const user = useAppSelector((state) => state.auth.user);
    if (!user) return false;
    return roles.includes(user.role);
}
