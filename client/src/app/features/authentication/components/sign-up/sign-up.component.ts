import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthenticationService = inject(AuthenticationService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  registrationForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    this.authService.registerUser(this.registrationForm.value)
      .subscribe({
        next: (res) => {
          this._snackBar.open('Successfully registered', 'close', {
            horizontalPosition: "right",
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/auth']);
        },
        error: (err) => {
          this._snackBar.open(`Error registering: ${err.error.error}`, 'close', {
            horizontalPosition: "right",
            verticalPosition: 'top',
            duration: 2000
          })
        }
      })
    console.log(this.registrationForm.value);
  }
}
