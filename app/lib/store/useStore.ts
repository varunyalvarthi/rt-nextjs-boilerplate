import { create } from 'zustand';
import { TaskSlice, createTaskSlice } from './slices/taskSlice';

interface StoreState extends TaskSlice {}

export const useStore = create<StoreState>((set, get) => ({
  ...createTaskSlice(set, get)
}));
