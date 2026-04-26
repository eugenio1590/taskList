import { Injectable } from '@angular/core';
import { TaskRepository } from '../../../repositories/task.repository';
import { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class GetTasksUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.repository.getTasks();
  }
}
