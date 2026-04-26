import { TestBed } from '@angular/core/testing';
import { UpdateTaskUseCase } from './update-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';
import { Task } from '../../../models/task.model';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      updateTask: jasmine.createSpy('updateTask').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        UpdateTaskUseCase,
        { provide: TaskRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(UpdateTaskUseCase);
  });

  it('should update a task when task is valid', async () => {
    const task: Task = { id: '1', title: 'Updated Task', completed: true };
    await useCase.execute(task);
    expect(repositoryMock.updateTask).toHaveBeenCalledWith(task);
  });

  it('should throw error if task title is empty', async () => {
    const task: Task = { id: '1', title: '', completed: false };
    await expectAsync(useCase.execute(task)).toBeRejectedWithError('Task title cannot be empty');
    expect(repositoryMock.updateTask).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    const task: Task = { id: '1', title: 'Valid', completed: false };
    repositoryMock.updateTask.and.returnValue(Promise.reject(new Error('Update failed')));
    await expectAsync(useCase.execute(task)).toBeRejectedWithError('Update failed');
  });
});
