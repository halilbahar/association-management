import { Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely';

export interface MemberTable {
  id: Generated<number>;
}

export type Member = Selectable<MemberTable>;
export type NewMember = Insertable<MemberTable>;
export type MemberUpdate = Updateable<MemberTable>;

export interface MemberDataTable {
  memberId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  joinedDate: Date;
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
  // CreatedAt
  // UpdatedAt
}

export type MemberData = Selectable<MemberDataTable>;
export type NewMemberData = Insertable<MemberDataTable>;
export type MemberDataUpdate = Updateable<MemberDataTable>;
