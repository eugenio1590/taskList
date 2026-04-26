import { Injectable } from '@angular/core';
import { ConfigurationRepository } from '../../repositories/configuration.repository';

@Injectable({
  providedIn: 'root',
})
export class IsAddTasksWithCategoryEnabledUseCase {
  constructor(private repository: ConfigurationRepository) {}

  async execute(): Promise<boolean> {
    try {
      return await this.repository.getBoolean('add_tasks_with_category');
    } catch (error) {
      console.error('Error fetching add_tasks_with_category flag', error);
      return false; // Default fallback
    }
  }
}
