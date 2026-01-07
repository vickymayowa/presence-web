import { useAppSelector } from '@/lib/store/hooks';
import { UserRole } from '@/lib/types';

/**
 * Hook to check if the current user has a specific permission
 * Permissions are defined in the usersSlice.rolePermissions
 */
export function usePermission() {
    const user = useAppSelector((state) => state.auth.user);
    const rolePermissions = useAppSelector((state) => state.users.rolePermissions);

    const hasPermission = (permission: string) => {
        if (!user) return false;
        const permissions = rolePermissions[user.role] || [];
        return permissions.includes('all') || permissions.includes(permission);
    };

    const isRole = (role: UserRole | UserRole[]) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        return user.role === role;
    };

    return {
        hasPermission,
        isRole,
        role: user?.role,
        isAdmin: user?.role === 'ceo' || user?.role === 'hr'
    };
}
