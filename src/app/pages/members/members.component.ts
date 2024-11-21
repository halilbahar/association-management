import { Component, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MemberData } from '~models/member.model';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {
  members = signal<MemberData[]>([]);

  ngOnInit(): void {

  }
}
