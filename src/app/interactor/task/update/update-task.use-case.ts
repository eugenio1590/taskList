import { Injectable } from '@angular/core';
import { TaskRepository } from '../../../repositories/task.repository';
import { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(task: Task): Promise<void> {
    if (!task.title || !task.title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    return await this.repository.updateTask(task);
  }
}
