import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  errorMessage: string = '';  // To store the error message
  isAdminLoggedIn: boolean = false;  // To check if the admin is logged in

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.checkAdminStatus();
  }

  // Check if the logged-in user is an admin
  checkAdminStatus() {
    this.authService.isAdmin().then(isAdmin => {
      this.isAdminLoggedIn = isAdmin;
    }).catch(error => {
      console.error('Error checking admin status', error);
      this.isAdminLoggedIn = false;
    });
  }

  // Log out functionality
  logout(): void {
    this.authService.logoutUser().then(() => {
      console.log('User logged out');
      this.errorMessage = '';  // Clear any previous error message
      this.isAdminLoggedIn = false;  // Set admin status to false on logout
    }).catch((error) => {
      this.errorMessage = error;  // Display the error message
      console.log('Logout failed', error);
    });
  }
}
