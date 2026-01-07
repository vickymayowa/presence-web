import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    activeTab: string;
}

const initialState: UIState = {
    sidebarOpen: true,
    theme: 'system',
    activeTab: 'dashboard',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.theme = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },
    },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
