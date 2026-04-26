import { TestBed } from '@angular/core/testing';
import { IsAddTasksWithCategoryEnabledUseCase } from './is-add-tasks-with-category-enabled.use-case';
import { ConfigurationRepository } from '../../repositories/configuration.repository';

describe('IsAddTasksWithCategoryEnabledUseCase', () => {
  let useCase: IsAddTasksWithCategoryEnabledUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      getBoolean: jasmine.createSpy('getBoolean').and.returnValue(Promise.resolve(true))
    };

    TestBed.configureTestingModule({
      providers: [
        IsAddTasksWithCategoryEnabledUseCase,
        { provide: ConfigurationRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(IsAddTasksWithCategoryEnabledUseCase);
  });

  it('should return true when flag is enabled', async () => {
    const result = await useCase.execute();
    expect(result).toBeTrue();
    expect(repositoryMock.getBoolean).toHaveBeenCalledWith('add_tasks_with_category');
  });

  it('should return false if repository fails', async () => {
    repositoryMock.getBoolean.and.returnValue(Promise.reject(new Error('Config Error')));
    const result = await useCase.execute();
    expect(result).toBeFalse();
  });
});
