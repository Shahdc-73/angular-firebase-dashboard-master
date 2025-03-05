import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

    user: Observable<any>;              // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

    constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
        this.user = null;
    }

    ngOnInit(): void {
        this.afAuth.authState.subscribe(admin => {                                                   // grab the user object from Firebase Authorization
            if (admin) {
                let emailLower = admin.email.toLowerCase();
                this.user = this.firestore.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
            }
        });
    }
}
