import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

    email: string;
    mailSent: boolean;
    isProgressVisible: boolean;
    firebaseErrorMessage: string;
    canResend: boolean = true;  // Controls the resend button
    resendTimer: number = 20;   // Timer for resend in seconds

    constructor(private authService: AuthService, private router: Router, public afAuth: AngularFireAuth) {
        this.email = '';
        this.mailSent = false;
        this.isProgressVisible = false;
        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.email = user.email;
            }
        });
    }

    resendVerificationEmail() {
        if (!this.canResend) return; // Prevent multiple clicks

        this.isProgressVisible = true;
        this.canResend = false; // Disable button

        this.authService.resendVerificationEmail().then((result) => {
            this.isProgressVisible = false;
            if (result == null) {  
                console.log('Verification email resent...');
                this.mailSent = true;

                // Start 20-second timer before enabling resend button
                let countdown = setInterval(() => {
                    this.resendTimer--;
                    if (this.resendTimer <= 0) {
                        clearInterval(countdown);
                        this.canResend = true;
                        this.resendTimer = 20; // Reset timer
                    }
                }, 1000);
            } else if (result.isValid == false) {
                console.log('Verification error', result);
                this.firebaseErrorMessage = result.message;
                this.canResend = true; // Allow retry if there's an error
                this.resendTimer = 20; // Reset timer
            }
        });
    }
}
