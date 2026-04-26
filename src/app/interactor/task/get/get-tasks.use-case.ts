import { Injectable } from '@angular/core';
import { TaskRepository } from '../../../repositories/task.repository';
import { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class GetTasksUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(page: number = 0, limit: number = 20, categoryId: string | null = null): Promise<Task[]> {
    const offset = page * limit;
    return await this.repository.getTasks(limit, offset, categoryId);
  }
}
