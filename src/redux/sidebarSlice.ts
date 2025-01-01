import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isExpanded: boolean;
  openDropdowns: number[]; 
}

const initialState: SidebarState = {
  isExpanded: true,
  openDropdowns: [],
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isExpanded = !state.isExpanded;
    },
    toggleDropdown(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.openDropdowns.includes(id)) {
        state.openDropdowns = state.openDropdowns.filter((item) => item !== id);
      } else {
        state.openDropdowns.push(id);
      }
    },
    setDropdowns(state, action: PayloadAction<number[]>) {
      state.openDropdowns = action.payload;
    },
  },
});

export const { toggleSidebar, toggleDropdown, setDropdowns } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
