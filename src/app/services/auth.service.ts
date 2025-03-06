import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn: boolean;      // other components can check on this variable for the login status of the user

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.userLoggedIn = false;
    this.afAuth.onAuthStateChanged((admin) => {
      this.userLoggedIn = !!admin;
    });
  }

  // Get current user's email (admin collection only)
  getCurrentUserEmail(): Observable<string> {
    return new Observable(observer => {
      this.afAuth.authState.subscribe(admin => {
        if (admin) {
          observer.next(admin.email);  
        } else {
          observer.next('');  
        }
      });
    });
  }

  // Get current user (from admin collection only)
  async getCurrentUser(): Promise<any> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const adminDoc = await this.afs.collection('admin').doc(user.email.toLowerCase()).get().toPromise();
      if (adminDoc.exists) {
        return adminDoc.data();
      } else {
        throw new Error('User is not an admin');
      }
    }
    throw new Error('User not authenticated');
  }

  // Check if user is admin (from admin collection only)
  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;  // If user exists in admin collection, they are admin
  }

  /////////// **REPORT MANAGEMENT** ///////////

  // Add a new report (Only admins can add reports)
  async addReport(report: { userId: string, postId: string, title: string, content: string }) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    return this.afs.collection('reports').add({
      userId: report.userId,
      postId: report.postId,
      title: report.title,
      content: report.content,
      timestamp: new Date(),
    }).then(() => {
      console.log('Report added successfully');
    }).catch(error => {
      console.log('Error adding report: ', error);
      throw error;
    });
  }

  // Get all reports
  getReports(): Observable<any[]> {
    return this.afs.collection('reports', ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  /////////// **AUTHENTICATION FUNCTIONS** ///////////

  // Get all users (from users collection)
  getAllUsersFromUsersCollection(): Observable<any[]> {
    return this.afs.collection('users', ref => ref.orderBy('email'))
      .valueChanges({ idField: 'id' });
  }

  // Login user (only allows admin login)
  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
      })
      .catch(error => {
        console.log('Auth Service: login error...', error);
        return { isValid: false, message: error.message };
      });
  }

  // Sign up user (create admin user)
  signupUser(user: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let emailLower = user.email.toLowerCase();

        this.afs.doc('/admin/' + emailLower)
          .set({
            accountType: 'admin',
            displayName: user.displayName,
            displayName_lower: user.displayName.toLowerCase(),
            email: user.email,
            email_lower: emailLower
          });

        result.user.sendEmailVerification();
      })
      .catch(error => {
        console.log('Auth Service: signup error', error);
        return { isValid: false, message: error.message };
      });
  }

  // Reset password
  resetPassword(email: string): Promise<any> {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Auth Service: reset password success');
      })
      .catch(error => {
        console.log('Auth Service: reset password error...', error);
        return error;
      });
  }

  // Resend verification email
  async resendVerificationEmail() {
    return (await this.afAuth.currentUser).sendEmailVerification()
      .catch(error => {
        console.log('Auth Service: sendVerificationEmail error...', error);
        return error;
      });
  }

  // Logout user
  logoutUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.currentUser.then(user => {
        if (!user) {
          reject('You are not logged in or registered');
          return;
        }

        if (window.confirm('Are you sure you want to log out?')) {
          this.afAuth.signOut()
            .then(() => {
              this.router.navigate(['/home']);
              resolve();
            })
            .catch(error => {
              console.log('Auth Service: logout error...', error);
              reject(error);
            });
        } else {
          resolve();
        }
      });
    });
  }

  // Save admin information to Firestore
  setUserInfo(payload: object) {
    this.afs.collection('admin')
      .add(payload).then(res => {
        console.log("Auth Service: setUserInfo response...", res);
      });
  }
}
