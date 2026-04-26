import { TestBed } from '@angular/core/testing';
import { CreateTaskUseCase } from './create-task.use-case';
import { TaskRepository } from '../../../repositories/task.repository';
import { Category } from '../../../models/category.model';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      addTask: jasmine.createSpy('addTask').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TaskRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(CreateTaskUseCase);
  });

  it('should create a task when title is valid', async () => {
    const title = 'Test Task';
    const category: Category = { id: '1', name: 'Work', color: 'blue' };

    const result = await useCase.execute(title, category);

    expect(repositoryMock.addTask).toHaveBeenCalled();
    expect(result.title).toBe(title);
    expect(result.category).toEqual(category);
    expect(result.completed).toBeFalse();
    expect(result.id).toBeDefined();
  });

  it('should throw error if title is empty', async () => {
    await expectAsync(useCase.execute('', null)).toBeRejectedWithError('Task title cannot be empty');
    expect(repositoryMock.addTask).not.toHaveBeenCalled();
  });

  it('should throw error if title is only whitespace', async () => {
    await expectAsync(useCase.execute('   ', null)).toBeRejectedWithError('Task title cannot be empty');
    expect(repositoryMock.addTask).not.toHaveBeenCalled();
  });

  it('should throw error if repository fails', async () => {
    repositoryMock.addTask.and.returnValue(Promise.reject(new Error('DB Error')));
    await expectAsync(useCase.execute('Valid title', null)).toBeRejectedWithError('DB Error');
  });
});
