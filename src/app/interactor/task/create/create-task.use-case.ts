import { Injectable } from '@angular/core';
import { TaskRepository } from '../../../repositories/task.repository';
import { Task } from '../../../models/task.model';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CreateTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(title: string, category: Category | null): Promise<void> {
    if (!title || !title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      category: category
    };

    return await this.repository.addTask(newTask);
  }
}
