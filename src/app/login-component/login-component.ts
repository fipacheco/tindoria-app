import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonTextarea,
  IonButton,
  IonIcon,
  IonCheckbox,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'login',
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonTextarea,
    IonButton,
    IonIcon,
    IonCheckbox,
  ],
})
export class LoginComponent implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(public router: Router) {
    addIcons({ personOutline, chevronBackOutline });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  goToSignUp() {
    this.router.navigateByUrl('cadastro');
  }
}
