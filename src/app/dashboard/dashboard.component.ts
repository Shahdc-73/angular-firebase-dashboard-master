import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users$: Observable<any[]> | null = null;  // Fetch all users
  admins$: Observable<any[]> | null = null;  // Fetch admin users

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      console.log('Dashboard: user', user);
      if (user) {
        // Fetch all users from Firestore
        this.users$ = this.firestore.collection('users').valueChanges({ idField: 'id' });

        // Fetch admin users from Firestore
        this.admins$ = this.firestore.collection('admin').valueChanges({ idField: 'id' });
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
