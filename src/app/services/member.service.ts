import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '~services/database.service';
import { MemberData, NewMemberData } from '~models/member.model';
import { InsertResult } from 'kysely';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private databaseService = inject(DatabaseService);
  private db = this.databaseService.kysely;

  async getTotalMemberCount(): Promise<number> {
    const result = await this.db
      .selectFrom('member')
      .select(this.db.fn.count<number>('id').as('count'))
      .executeTakeFirstOrThrow();

    return result.count;
  }

  async getMembersWithLatestData(pageSize: number, offset: number): Promise<{
    memberId: number,
    memberData: MemberData
  }[]> {
    const subquery = this.db
      .selectFrom('memberData')
      .select(['memberId', this.db.fn.max('createdAt').as('maxCreatedAt')])
      .groupBy('memberId')
      .as('latestMemberData');

    // todo: join via createdAt is not good. instead fetch the memberDataId in the subquery
    //  and join only via memberDataId
    const members = await this.db
      .selectFrom('memberData')
      .innerJoin(subquery, (join) =>
        join.onRef('memberData.memberId', '=', 'latestMemberData.memberId')
          .onRef('memberData.createdAt', '=', 'latestMemberData.maxCreatedAt')
      )
      .selectAll()
      .orderBy('memberData.createdAt', 'desc')
      .limit(pageSize)
      .offset(offset)
      .execute();

    const uniqueMembers = new Map<number, MemberData>();

    for (const member of members) {
      if (!uniqueMembers.has(member.memberId)) {
        uniqueMembers.set(member.memberId, member as MemberData);
      }
    }

    return Array.from(uniqueMembers, ([memberId, memberData]) => ({ memberId, memberData }));
  }

  async createMember(memberData: NewMemberData): Promise<InsertResult> {
    return this.db.transaction().execute(async trx => {
      const memberId = await trx
        .insertInto('member')
        .defaultValues()
        .returning('id')
        .executeTakeFirstOrThrow()
        .then((res) => res.id);

      console.log(memberData);
      return await trx.insertInto('memberData').values({
        ...memberData,
        memberId
      }).executeTakeFirst();
    });
  }
}
