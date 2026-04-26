import { Injectable } from '@angular/core';
import { Database } from '../../../services/database';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class GetCategoriesUseCase {
  constructor(private database: Database) {}

  async execute(): Promise<Category[]> {
    return await this.database.getCategories();
  }
}
