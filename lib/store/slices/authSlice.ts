import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        updateRole: (state, action: PayloadAction<UserRole>) => {
            if (state.user) {
                state.user.role = action.payload;
            }
        },
    },
});

export const { setUser, setLoading, setError, logout, updateRole } = authSlice.actions;
export default authSlice.reducer;
