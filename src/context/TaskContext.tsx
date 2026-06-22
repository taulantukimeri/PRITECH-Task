import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Task, FilterStatus } from '../types';
import { StorageService } from '../utils/storage';
import { generateId } from '../utils/helpers';

// ─── State ───────────────────────────────────────────────────────────────────

interface State {
  tasks: Task[];
  filter: FilterStatus;
  search: string;
  loading: boolean;
}

const initialState: State = {
  tasks: [],
  filter: 'all',
  search: '',
  loading: true,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
            : t,
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface TaskContextValue extends State {
  filteredTasks: Task[];
  addTask: (title: string, description: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  setFilter: (filter: FilterStatus) => void;
  setSearch: (search: string) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to AsyncStorage whenever tasks change
  useEffect(() => {
    if (!state.loading) {
      StorageService.saveTasks(state.tasks);
    }
  }, [state.tasks, state.loading]);

  // Load from storage on mount
  useEffect(() => {
    StorageService.loadTasks().then((tasks) => {
      dispatch({ type: 'SET_TASKS', payload: tasks });
    });
  }, []);

  const filteredTasks = state.tasks.filter((task) => {
    const matchesFilter =
      state.filter === 'all' || task.status === state.filter;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(state.search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addTask = useCallback((title: string, description: string) => {
    const task: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const getTaskById = useCallback(
    (id: string) => state.tasks.find((t) => t.id === id),
    [state.tasks],
  );

  const setFilter = useCallback((filter: FilterStatus) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        getTaskById,
        setFilter,
        setSearch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}
