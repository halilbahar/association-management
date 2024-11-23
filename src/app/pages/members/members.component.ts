import { Component, inject, OnInit, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MemberData } from '~models/member.model';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { MemberService } from '~services/member.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [Toolbar, Button, RouterLink, TableModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {
  private memberService = inject(MemberService);
  loading = signal(true);
  members = signal<MemberData[]>([]);
  totalRecords = signal(-1);

  ngOnInit(): void {
    this.memberService.getTotalMemberCount()
      .then(totalRecords => this.totalRecords.set(totalRecords));
  }

  loadMembers(event: TableLazyLoadEvent) {
    this.loading.set(true);
    this.memberService.getMembersWithLatestData(event.rows || 10, event.first || 0)
      .then(members => {
        this.members.set(members.map(m => m.memberData));
        this.loading.set(false);
      });
  }
}
