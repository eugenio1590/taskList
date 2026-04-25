import { Category } from './category.model';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category?: Category | null;
}