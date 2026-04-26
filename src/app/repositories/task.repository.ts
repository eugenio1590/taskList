import { Task } from '../models/task.model';

export abstract class TaskRepository {
  abstract getTasks(limit?: number, offset?: number, categoryId?: string | null): Promise<Task[]>;
  abstract addTask(task: Task): Promise<void>;
  abstract updateTask(task: Task): Promise<void>;
  abstract deleteTask(id: string): Promise<void>;
}
