import { Injectable } from '@angular/core';
import { CategoryRepository } from '../../../repositories/category.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteCategoryUseCase {
  constructor(private repository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Category ID is required for deletion');
    }

    return await this.repository.deleteCategory(id);
  }
}
