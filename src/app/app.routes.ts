import { Routes } from '@angular/router';
import { MembersComponent } from './pages/members/members.component';
import { UpsertMemberComponent } from './pages/members/upsert-member/upsert-member.component';

export const routes: Routes = [
  {
    path: 'members', children: [
      { path: '', component: MembersComponent },
      { path: 'new', component: UpsertMemberComponent }
    ]
  }
];
