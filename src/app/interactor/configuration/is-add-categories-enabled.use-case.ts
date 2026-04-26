import { Injectable } from '@angular/core';
import { ConfigurationRepository } from '../../repositories/configuration.repository';

@Injectable({
  providedIn: 'root',
})
export class IsAddCategoriesEnabledUseCase {
  constructor(private repository: ConfigurationRepository) {}

  async execute(): Promise<boolean> {
    try {
      return await this.repository.getBoolean('enable_add_categories');
    } catch (error) {
      console.error('Error fetching enable_add_categories flag', error);
      return false; // Default fallback
    }
  }
}
