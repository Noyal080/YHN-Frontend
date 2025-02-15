// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import sidebarReducer from './sidebarSlice'
import authReducer from "./authSlice"

const persistConfig = {
  key : "auth",
  storage
}

const persistedAuth = persistReducer(persistConfig , authReducer)

export const store = configureStore({
  reducer: {
    auth : persistedAuth,
    sidebar: sidebarReducer, // Add more reducers as needed
  },
});


export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
