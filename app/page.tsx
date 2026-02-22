"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, Plus, Trash2, CheckCircle2, Circle, Clock, Loader2, LayoutDashboard, User } from 'lucide-react';
import api from '../utils/api';

interface UserProfile {
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch user profile
      const userRes = await api.get('/users/me');
      setUser(userRes.data);
      // Fetch tasks
      await fetchTasks();
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/signin');
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/');
      setTasks(res.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/signin');
      } else if (error.response?.status === 404) {
        setTasks([]); // No tasks found
      } else {
        toast.error("Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get('/users/logout');
      toast.success("Logged out");
      router.push('/signin');
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      const res = await api.post('/', { title, description, status: 'pending' });
      setTasks([...tasks, res.data.task]);
      setTitle('');
      setDescription('');
      toast.success("Task created!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const originalTasks = [...tasks];
    setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus as any } : t));
    try {
      if (newStatus === 'completed') {
        await api.put(`/CompleteTask/${id}`);
      } else {
        await api.put(`/UpdateTask/${id}`, { status: newStatus });
      }
    } catch {
      toast.error("Failed to update status");
      setTasks(originalTasks);
    }
  };

  const handleDeleteRequest = (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (task) setTaskToDelete(task);
  };

  const executeDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/DeleteTask/${taskToDelete._id}`);
      setTasks(tasks.filter(t => t._id !== taskToDelete._id));
      toast.success("Task deleted");
      setTaskToDelete(null);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const uncompletedTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent">Tasks</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/40 border border-white/5">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-neutral-300">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-12">
        {/* Delete Confirmation Modal */}
        {taskToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Delete Task</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-medium">&quot;{taskToDelete.title}&quot;</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center min-w-[80px] disabled:opacity-50 font-medium"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Task Form */}
        <section className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold mb-4 text-neutral-200">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-20 resize-none bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
              />
            </div>
            <button
              type="submit"
              disabled={!title.trim() || adding}
              className="h-[104px] px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
              <span>Add</span>
            </button>
          </form>
        </section>

        {/* Tasks Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Uncompleted */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-300 flex items-center gap-2">
              Active Tasks
              <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-full">{uncompletedTasks.length}</span>
            </h2>
            {uncompletedTasks.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                No active tasks. Enjoy your day!
              </div>
            ) : (
              <div className="space-y-3">
                {uncompletedTasks.map(task => (
                  <TaskCard key={task._id} task={task} onStatusChange={handleUpdateStatus} onDelete={handleDeleteRequest} />
                ))}
              </div>
            )}
          </section>

          {/* Completed */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-300 flex items-center gap-2">
              Completed
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">{completedTasks.length}</span>
            </h2>
            {completedTasks.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                No completed tasks yet.
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard key={task._id} task={task} onStatusChange={handleUpdateStatus} onDelete={handleDeleteRequest} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function TaskCard({ task, onStatusChange, onDelete }: { task: Task, onStatusChange: (id: string, st: string) => void, onDelete: (id: string) => void }) {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg group
            ${isCompleted ? 'bg-neutral-900/30 border-neutral-800/50 opacity-75 grayscale-[0.3]' : 'bg-neutral-900 border-neutral-800/80 hover:border-neutral-700'}`}>
      <div className="flex gap-4">
        <button
          onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
          className={`mt-0.5 shrink-0 hover:scale-110 transition-transform ${isCompleted ? 'text-emerald-500' : 'text-neutral-500 hover:text-indigo-400'}`}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 truncate ${isCompleted ? 'text-neutral-400 line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {!isCompleted && (
                <button
                  onClick={() => onStatusChange(task._id, isInProgress ? 'pending' : 'in-progress')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors
                                        ${isInProgress ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {isInProgress ? 'In Progress' : 'Pending'}
                </button>
              )}
              <span className="text-[10px] text-neutral-600 font-medium">
                {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <button
              onClick={() => onDelete(task._id)}
              className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
