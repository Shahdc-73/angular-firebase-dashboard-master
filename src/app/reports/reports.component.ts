import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthGuard } from '../services/auth.guard';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];
  errorMessage: string = '';

  constructor(private afs: AngularFirestore, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  // Load reports from Firestore
  loadReports(): void {
    this.afs.collection('reports', ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' })
      .subscribe(
        reports => {
          this.reports = reports;
        },
        error => {
          this.errorMessage = 'Failed to load reports';
          console.error('Error loading reports:', error);
        }
      );
  }

  // Display reports
  displayReports(): any[] {
    return this.reports;
  }
}
