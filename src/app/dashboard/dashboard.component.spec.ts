import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const authMock = {
      authState: of({ email: 'test@example.com' })
    };

    const firestoreMock = {
      collection: () => ({
        doc: () => ({
          valueChanges: () => of({
            accountType: 'Admin',
            displayName: 'Test User',
            email: 'test@example.com',
            emailVerified: true
          })
        })
      })
    };

    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [
        { provide: AngularFireAuth, useValue: authMock },
        { provide: AngularFirestore, useValue: firestoreMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data correctly', () => {
    expect(component.userData.length).toBeGreaterThan(0);
    expect(component.userData[0].displayName).toBe('Test User');
  });
});
