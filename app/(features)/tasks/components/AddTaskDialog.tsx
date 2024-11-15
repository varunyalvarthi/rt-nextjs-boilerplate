'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Task, TaskPriority, TaskType } from '@/app/types/task';
import { useStore } from '@/app/lib/store';

interface AddTaskDialogProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskDialog = ({ projectId, isOpen, onClose }: AddTaskDialogProps) => {
  const addTask = useStore(state => state.addTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('task');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Partial<Task> = {
      title,
      description,
      type,
      priority,
      projectId,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addTask(newTask);
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setType('task');
    setPriority('medium');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-white/90">Add New Task</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white/90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm text-white/60">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/90 placeholder:text-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm text-white/60">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/90 placeholder:text-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm text-white/60">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/90 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="task">Task</option>
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="story">Story</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm text-white/60">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/90 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/90"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
