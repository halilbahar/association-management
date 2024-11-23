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

  /**
   * Retrieves the total count of members from the database.
   *
   * @return {Promise<number>} A promise that resolves to the total number of members.
   */
  async getTotalMemberCount(): Promise<number> {
    const result = await this.db
      .selectFrom('member')
      .select(this.db.fn.count<number>('id').as('count'))
      .executeTakeFirstOrThrow();

    return result.count;
  }

  /**
   * Retrieves a paginated list of members along with their latest data.
   *
   * @param {number} pageSize - The number of members to retrieve per page.
   * @param {number} offset - The number of members to skip before starting to collect the result set.
   * @return {Promise<Array<{memberId: number, memberData: MemberData}>>} A promise that resolves to an array of objects, each containing a member's ID and their latest data.
   */
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

  /**
   * Creates a new member and inserts the corresponding member data into the database.
   *
   * @param {NewMemberData} memberData - The data associated with the new member.
   * @return {Promise<InsertResult>} A promise that resolves to the result of the insert operation.
   */
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

  /**
   * Retrieves a member's data from the database using their unique member ID.
   *
   * @param {number} memberId - The unique identifier of the member.
   * @return {Promise<MemberData | undefined>} - A promise that resolves to the member's data if found, or undefined if no record is found.
   */
  async getMemberById(memberId: number): Promise<MemberData | undefined> {
    let memberData = await this.db
      .selectFrom('memberData')
      .selectAll()
      .where('memberId', '=', memberId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .executeTakeFirst();

    // TODO: write global serializer for stringified json
    return memberData;
  }
}
