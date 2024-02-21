import { Task } from '../types/Task';
import { client } from '../utils/fetchTasks';

export const getTodos = (date: string) => {
  return client.get<Task[]>(`/task/${date}`);
};

export const addTodos = (newTask: Omit<Task, 'id'>) => {
  return client.post<Task>('/task', newTask);
};


export const deleteTodos = (id: string) => {
  return client.delete(`/task/${id}`);
};

export const updateTodo = (id: string, todo:Omit <Task, 'id'>) => {
  return client.patch<Task>(`/task/${id}`, todo);
};