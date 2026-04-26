import { Injectable } from '@angular/core';
import { Database } from '../../../services/database';

@Injectable({
  providedIn: 'root',
})
export class DeleteCategoryUseCase {
  constructor(private database: Database) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Category ID is required for deletion');
    }

    return await this.database.deleteCategory(id);
  }
}
