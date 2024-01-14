import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {Router} from "@angular/router";
import {IdentityService} from "../../../../core/services/identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private identityService = inject(IdentityService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  signInForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  onSubmit(): void {
    this.authService.signUserIn(this.signInForm.value)
      .subscribe({
        next: ({token, user}) => {
          this.identityService.setUser(user);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('err: ', err);
          this._snackBar.open(`Error signing in: ${err.error.error}`, 'close', {
            horizontalPosition: "right",
            verticalPosition: 'top',
            duration: 2000
          })
        }
      })
    console.log(this.signInForm.value);
  }
}
