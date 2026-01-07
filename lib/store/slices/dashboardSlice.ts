import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
    dateRange: {
        from: string;
        to: string;
    };
    selectedDepartment: string | 'all';
    viewMode: 'grid' | 'table';
    searchQuery: string;
    statsRefreshInterval: number; // in seconds
}

const initialState: DashboardState = {
    dateRange: {
        from: new Date().toISOString(),
        to: new Date().toISOString(),
    },
    selectedDepartment: 'all',
    viewMode: 'grid',
    searchQuery: '',
    statsRefreshInterval: 30,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<{ from: string; to: string }>) => {
            state.dateRange = action.payload;
        },
        setDepartment: (state, action: PayloadAction<string>) => {
            state.selectedDepartment = action.payload;
        },
        setViewMode: (state, action: PayloadAction<'grid' | 'table'>) => {
            state.viewMode = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setRefreshInterval: (state, action: PayloadAction<number>) => {
            state.statsRefreshInterval = action.payload;
        },
        resetFilters: (state) => {
            state.selectedDepartment = 'all';
            state.searchQuery = '';
            state.dateRange = initialState.dateRange;
        },
    },
});

export const {
    setDateRange,
    setDepartment,
    setViewMode,
    setSearchQuery,
    setRefreshInterval,
    resetFilters
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
