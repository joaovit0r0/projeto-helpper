import { Member } from 'library';

export type TFilteredMember = Pick<Member, 'allowance' | 'birthdate' | 'id' | 'photo' | 'name'>;
