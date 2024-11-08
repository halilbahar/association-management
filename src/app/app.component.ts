import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavContainer, MatSidenavContent, MatSidenav, MatNavList, MatListItem, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'page'
  }
})
export class AppComponent {
}
