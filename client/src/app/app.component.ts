import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./core/components/header/header.component";
import {AuthenticationService} from "./core/services/authentication/authentication.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private authService = inject(AuthenticationService);

  ngOnInit(): void {
    const authToken = localStorage.getItem('auth-token');
    if (authToken && !this.authService.isTokenExpired(authToken)) {
      this.authService.signExistingUserIn();
    }
  }
}
