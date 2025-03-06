import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    mailSent: boolean;
    isProgressVisible: boolean;
    forgotPasswordForm: FormGroup;
    firebaseErrorMessage: string;
    adminEmail: string = '';  // Added adminEmail to store the current logged-in user's email

    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {
        this.mailSent = false;
        this.isProgressVisible = false;

        this.forgotPasswordForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email])
        });

        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        // Subscribe to auth state and update the admin's email if logged in
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.adminEmail = user.email;  // Store the logged-in admin's email
                this.forgotPasswordForm.patchValue({
                    email: user.email
                });
            }
        });
    }

    retrievePassword() {
        this.isProgressVisible = true;  // Show the progress indicator

        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Call resetPassword method from AuthService
        this.authService.resetPassword(this.forgotPasswordForm.value.email).then((result) => {
            this.isProgressVisible = false;  // Hide the progress indicator

            if (result == null) {  // Success
                console.log('Password reset email sent...');
                this.mailSent = true;
            } else if (result.isValid === false) {  // Error
                console.log('Login error', result);
                this.firebaseErrorMessage = result.message;
            }
        });
    }
}
