import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemberService } from '~services/member.service';
import { MemberData } from '~models/member.model';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TableModule, DatePipe, Button, RouterLink, TranslatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private memberService = inject(MemberService);
  member = signal<MemberData[]>([]);

  ngOnInit(): void {
    let memberId = this.route.snapshot.params['id'];
    this.memberService
      .getMemberById(memberId)
      .then(m => {
        if (m?.memberId) {
          this.member.set([m]);
        }
      });
  }
}
