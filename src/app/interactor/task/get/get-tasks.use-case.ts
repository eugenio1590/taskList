import { Injectable } from '@angular/core';
import { Database } from '../../../services/database';
import { Task } from '../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class GetTasksUseCase {
  constructor(private database: Database) {}

  async execute(): Promise<Task[]> {
    return await this.database.getTasks();
  }
}
