import { Injectable } from '@angular/core';
import { Database } from '../../../services/database';
import { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateTaskUseCase {
  constructor(private database: Database) {}

  async execute(task: Task): Promise<void> {
    if (!task.title || !task.title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    return await this.database.updateTask(task);
  }
}
