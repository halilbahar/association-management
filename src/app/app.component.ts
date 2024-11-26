import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

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
  menuItems = [
    {
      icon: 'pi-users',
      label: 'Members',
      route: '/members'
    }
  ];
}
