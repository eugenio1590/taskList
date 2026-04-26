import { Task } from '../models/task.model';

export abstract class TaskRepository {
  abstract getTasks(): Promise<Task[]>;
  abstract addTask(task: Task): Promise<void>;
  abstract updateTask(task: Task): Promise<void>;
  abstract deleteTask(id: string): Promise<void>;
}
