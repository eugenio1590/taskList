import { TestBed } from '@angular/core/testing';
import { GetTasksUseCase } from './get-tasks.use-case';
import { TaskRepository } from '../../../repositories/task.repository';
import { Task } from '../../../models/task.model';

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      getTasks: jasmine.createSpy('getTasks').and.returnValue(Promise.resolve([]))
    };

    TestBed.configureTestingModule({
      providers: [
        GetTasksUseCase,
        { provide: TaskRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(GetTasksUseCase);
  });

  it('should return tasks from repository', async () => {
    const mockTasks: Task[] = [{ id: '1', title: 'T1', completed: false }];
    repositoryMock.getTasks.and.returnValue(Promise.resolve(mockTasks));

    const result = await useCase.execute(1, 10, 'cat1');

    expect(repositoryMock.getTasks).toHaveBeenCalledWith(10, 10, 'cat1');
    expect(result).toEqual(mockTasks);
  });

  it('should use default values if not provided', async () => {
    await useCase.execute();
    expect(repositoryMock.getTasks).toHaveBeenCalledWith(20, 0, null);
  });

  it('should throw error if repository fails', async () => {
    repositoryMock.getTasks.and.returnValue(Promise.reject(new Error('Load Error')));
    await expectAsync(useCase.execute()).toBeRejectedWithError('Load Error');
  });
});
