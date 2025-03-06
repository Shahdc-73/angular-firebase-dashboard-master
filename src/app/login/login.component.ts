import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  firebaseErrorMessage: string = '';
  loginSuccess: boolean = false;
  isProgressVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.isProgressVisible = true;
      const { email, password } = this.loginForm.value;

      this.authService.loginUser(email, password).then(
        (res) => {
          this.isProgressVisible = false;
          this.loginSuccess = true;
            this.router.navigate(['/dashboard']);  
         
        },
        (err) => {
          this.isProgressVisible = false;
          this.firebaseErrorMessage = err.message;
        }
      );
    }
  }
}
