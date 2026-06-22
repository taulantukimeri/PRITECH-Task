export interface TaskSuggestion {
  title: string;
}

export async function fetchTaskSuggestion(): Promise<TaskSuggestion> {
  const response = await fetch('https://dummyjson.com/todos/random');
  if (!response.ok) throw new Error('Failed to fetch suggestion');
  const data = await response.json();
  return { title: data.todo as string };
}
