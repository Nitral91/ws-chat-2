import {Component, computed, effect, inject, signal} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {IdentityService} from "../../services/identity/identity.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private identityService = inject(IdentityService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  isLoggedIn = computed(() => !!this.identityService.currentUser());

  constructor() {
  }

  logUserOut(): void {
    this.authService.logoutCurrentUser();
    this.identityService.clearUser();
    this.router.navigate(['/auth']);
  }
}
