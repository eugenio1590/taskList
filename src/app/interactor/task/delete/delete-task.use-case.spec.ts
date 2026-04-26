import { TestBed } from '@angular/core/testing';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      deleteTask: jasmine.createSpy('deleteTask').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        DeleteTaskUseCase,
        { provide: TaskRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(DeleteTaskUseCase);
  });

  it('should call deleteTask when id is provided', async () => {
    const id = '123';
    await useCase.execute(id);
    expect(repositoryMock.deleteTask).toHaveBeenCalledWith(id);
  });

  it('should throw error if id is empty', async () => {
    await expectAsync(useCase.execute('')).toBeRejectedWithError('Task ID is required for deletion');
    expect(repositoryMock.deleteTask).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    repositoryMock.deleteTask.and.returnValue(Promise.reject(new Error('Delete Error')));
    await expectAsync(useCase.execute('123')).toBeRejectedWithError('Delete Error');
  });
});
