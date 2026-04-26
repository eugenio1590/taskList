import { TestBed } from '@angular/core/testing';
import { CreateCategoryUseCase } from './create-category.use-case';
import { CategoryRepository } from '../../../repositories/category.repository';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      addCategory: jasmine.createSpy('addCategory').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        CreateCategoryUseCase,
        { provide: CategoryRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(CreateCategoryUseCase);
  });

  it('should call addCategory when data is valid', async () => {
    const name = 'New Category';
    const color = '#ff0000';
    await useCase.execute(name, color);
    expect(repositoryMock.addCategory).toHaveBeenCalled();
  });

  it('should throw error if name is empty', async () => {
    await expectAsync(useCase.execute('', '#000')).toBeRejectedWithError('Category name cannot be empty');
    expect(repositoryMock.addCategory).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    repositoryMock.addCategory.and.returnValue(Promise.reject(new Error('Save Category Error')));
    await expectAsync(useCase.execute('Work', 'blue')).toBeRejectedWithError('Save Category Error');
  });
});
