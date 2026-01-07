import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';

interface UsersState {
    allUsers: User[];
    selectedUser: User | null;
    rolePermissions: Record<UserRole, string[]>;
    isUpdatingRole: boolean;
}

const initialState: UsersState = {
    allUsers: [],
    selectedUser: null,
    rolePermissions: {
        ceo: ['all', 'manage_company', 'view_reports', 'manage_users', 'check_in'],
        hr: ['view_reports', 'manage_users', 'view_attendance', 'check_in'],
        manager: ['view_team', 'approve_leave', 'view_reports', 'check_in'],
        staff: ['check_in', 'view_own_attendance', 'request_leave'],
    },
    isUpdatingRole: false,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setAllUsers: (state, action: PayloadAction<User[]>) => {
            state.allUsers = action.payload;
        },
        selectUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
        updateUserRole: (state, action: PayloadAction<{ userId: string; newRole: UserRole }>) => {
            const user = state.allUsers.find(u => u.id === action.payload.userId);
            if (user) {
                user.role = action.payload.newRole;
            }
            if (state.selectedUser?.id === action.payload.userId) {
                state.selectedUser.role = action.payload.newRole;
            }
        },
        setUpdatingRole: (state, action: PayloadAction<boolean>) => {
            state.isUpdatingRole = action.payload;
        },
    },
});

export const { setAllUsers, selectUser, updateUserRole, setUpdatingRole } = usersSlice.actions;
export default usersSlice.reducer;
