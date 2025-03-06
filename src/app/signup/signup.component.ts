import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    isProgressVisible: boolean;
    signupForm: FormGroup;
    firebaseErrorMessage: string;
    showLoginButton: boolean;  // New flag to show login button

    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {
        this.isProgressVisible = false;
        this.firebaseErrorMessage = '';
        this.showLoginButton = false;  // Initially, don't show the login button
    }

    ngOnInit(): void {
        if (this.authService.userLoggedIn) {                       
            this.router.navigate(['/dashboard']);
        }

        this.signupForm = new FormGroup({
            'displayName': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });
    }

    signup() {
        if (this.signupForm.invalid)  // If there's an error in the form, don't submit it
            return;

        this.isProgressVisible = true;
        this.authService.signupUser(this.signupForm.value).then((result) => {
            if (result == null) {  // null is success
                this.router.navigate(['/dashboard']);
            } else if (result.isValid == false) {  // Error occurs
                this.firebaseErrorMessage = result.message;
                // Check if the error is 'email already in use'
                if (result.message.includes('already in use')) {
                    this.showLoginButton = true;  // Show the login button
                }
            }

            this.isProgressVisible = false;  // Hide the progress indicator
        }).catch((error) => {
            this.isProgressVisible = false;
            // Handle any additional error that might occur
            console.error(error);
        });
    }
}
