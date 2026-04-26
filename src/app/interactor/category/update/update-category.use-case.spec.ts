import { TestBed } from '@angular/core/testing';
import { UpdateCategoryUseCase } from './update-category.use-case';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category } from '../../../models/category.model';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      updateCategory: jasmine.createSpy('updateCategory').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        UpdateCategoryUseCase,
        { provide: CategoryRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(UpdateCategoryUseCase);
  });

  it('should call updateCategory when category is valid', async () => {
    const cat: Category = { id: '1', name: 'Work', color: 'blue' };
    await useCase.execute(cat);
    expect(repositoryMock.updateCategory).toHaveBeenCalledWith(cat);
  });

  it('should throw error if name is empty', async () => {
    const cat: Category = { id: '1', name: '', color: 'blue' };
    await expectAsync(useCase.execute(cat)).toBeRejectedWithError('Category name cannot be empty');
    expect(repositoryMock.updateCategory).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    const cat: Category = { id: '1', name: 'Work', color: 'blue' };
    repositoryMock.updateCategory.and.returnValue(Promise.reject(new Error('Update Category Error')));
    await expectAsync(useCase.execute(cat)).toBeRejectedWithError('Update Category Error');
  });
});
