import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TaskSlice, createTaskSlice } from './slices/taskSlice';

interface StoreState extends TaskSlice {}

export const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createTaskSlice(...a),
    }),
    { name: 'DeepKaam Store' }
  )
);
