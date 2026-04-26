import { TestBed } from '@angular/core/testing';
import { GetCategoriesUseCase } from './get-categories.use-case';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category } from '../../../models/category.model';

describe('GetCategoriesUseCase', () => {
  let useCase: GetCategoriesUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(Promise.resolve([]))
    };

    TestBed.configureTestingModule({
      providers: [
        GetCategoriesUseCase,
        { provide: CategoryRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(GetCategoriesUseCase);
  });

  it('should return categories from repository', async () => {
    const mockCategories: Category[] = [{ id: '1', name: 'Work', color: 'blue' }];
    repositoryMock.getCategories.and.returnValue(Promise.resolve(mockCategories));

    const result = await useCase.execute();

    expect(repositoryMock.getCategories).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  it('should throw error if repository fails', async () => {
    repositoryMock.getCategories.and.returnValue(Promise.reject(new Error('Load Categories Error')));
    await expectAsync(useCase.execute()).toBeRejectedWithError('Load Categories Error');
  });
});
