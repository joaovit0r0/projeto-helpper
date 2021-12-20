import { Task } from 'library/database/entity';

export type TFilteredTask = Pick<Task, 'id' | 'description'>;
