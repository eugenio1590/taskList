import { Injectable } from '@angular/core';
import { TaskRepository } from '../../../repositories/task.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Task ID is required for deletion');
    }

    return await this.repository.deleteTask(id);
  }
}
