// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from './sidebarSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer, // Add more reducers as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
