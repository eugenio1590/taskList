import { Injectable } from '@angular/core';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class GetCategoriesUseCase {
  constructor(private repository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return await this.repository.getCategories();
  }
}
