import { TestBed } from '@angular/core/testing';
import { DeleteCategoryUseCase } from './delete-category.use-case';
import { CategoryRepository } from '../../../repositories/category.repository';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        DeleteCategoryUseCase,
        { provide: CategoryRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(DeleteCategoryUseCase);
  });

  it('should call deleteCategory when id is provided', async () => {
    await useCase.execute('123');
    expect(repositoryMock.deleteCategory).toHaveBeenCalledWith('123');
  });

  it('should throw error if id is empty', async () => {
    await expectAsync(useCase.execute('')).toBeRejectedWithError('Category ID is required for deletion');
    expect(repositoryMock.deleteCategory).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    repositoryMock.deleteCategory.and.returnValue(Promise.reject(new Error('Delete Category Error')));
    await expectAsync(useCase.execute('123')).toBeRejectedWithError('Delete Category Error');
  });
});
