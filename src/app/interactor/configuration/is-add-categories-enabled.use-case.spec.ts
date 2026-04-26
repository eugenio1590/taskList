import { TestBed } from '@angular/core/testing';
import { IsAddCategoriesEnabledUseCase } from './is-add-categories-enabled.use-case';
import { ConfigurationRepository } from '../../repositories/configuration.repository';

describe('IsAddCategoriesEnabledUseCase', () => {
  let useCase: IsAddCategoriesEnabledUseCase;
  let repositoryMock: any;

  beforeEach(() => {
    repositoryMock = {
      getBoolean: jasmine.createSpy('getBoolean').and.returnValue(Promise.resolve(true))
    };

    TestBed.configureTestingModule({
      providers: [
        IsAddCategoriesEnabledUseCase,
        { provide: ConfigurationRepository, useValue: repositoryMock }
      ]
    });

    useCase = TestBed.inject(IsAddCategoriesEnabledUseCase);
  });

  it('should return true when flag is enabled', async () => {
    const result = await useCase.execute();
    expect(result).toBeTrue();
    expect(repositoryMock.getBoolean).toHaveBeenCalledWith('enable_add_categories');
  });
});
