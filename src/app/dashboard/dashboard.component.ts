import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  
})
export class DashboardComponent implements OnInit {
  user: Observable<any> | null = null;
  userData: any[] = [];
  displayedColumns: string[] = ['accountType', 'displayName', 'email', 'emailVerified', 'status'];

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.email) {
        const emailLower = user.email.toLowerCase();
        this.user = this.firestore.collection('users').doc(emailLower).valueChanges();

        this.user.subscribe(userData => {
          if (userData) {
            this.userData = [{
              accountType: userData.accountType,
              displayName: userData.displayName,
              email: userData.email,
              emailVerified: user.emailVerified,
              isActive: Math.random() > 0.5 // ✅ محاكاة حالة المستخدم (يجب استبدالها ببيانات حقيقية من Firebase)
            }];
          } else {
            this.userData = [];
          }
        });
      } else {
        this.userData = [];
      }
    });
  }
}
