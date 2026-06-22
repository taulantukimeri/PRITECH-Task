export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export type FilterStatus = 'all' | 'pending' | 'completed';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  AddEditTask: { taskId?: string };
};
