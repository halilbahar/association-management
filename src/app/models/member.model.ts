import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely';

export interface MemberTable {
  id: Generated<number>;
  createdAt: ColumnType<number, never, never>;
  updatedAt: ColumnType<number, never, number>;
}

export type Member = Selectable<MemberTable>;
export type NewMember = Insertable<MemberTable>;
export type MemberUpdate = Updateable<MemberTable>;

export interface MemberDataTable {
  memberId: number;
  firstName: string;
  lastName: string;
  birthDate: number;
  joinedDate: number;
  gender: 'female' | 'male';
  nationality: string;
  notes: string;
  emails: JSONColumnType<{
    email: string;
    description: string;
  }[]>;
  addresses: JSONColumnType<{
    street: string;
    city: string;
    zip: string;
  }[]>;
  phoneNumbers: JSONColumnType<{
    phoneNumber: string;
    description: string;
  }[]>;
  createdAt: ColumnType<number, never, never>;
  updatedAt: ColumnType<number, never, number>;
}

export type MemberData = Selectable<MemberDataTable>;
export type NewMemberData = Insertable<MemberDataTable>;
export type MemberDataUpdate = Updateable<MemberDataTable>;
