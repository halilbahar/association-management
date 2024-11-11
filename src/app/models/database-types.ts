import { MemberDataTable, MemberTable } from './member.model';

export interface Database {
  member: MemberTable,
  memberData: MemberDataTable
}
