import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'page'
  }
})
export class AppComponent {
  t = inject(DatabaseService);

  menuItems = [
    {
      icon: 'pi-users',
      label: 'Members',
      route: '/members'
    }
  ];
}
