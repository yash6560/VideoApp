import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem('yashvideo-theme') || 'night',

    setTheme : (theme) => {
        localStorage.setItem('yashvideo-theme', theme);
        set({ theme });
    },
}))