import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  IonInput,
  AlertController,
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
    IonInput,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
})
export class LoginComponent implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  signInForm: FormGroup;
  isAlertOpen = false;
  
  constructor(public router: Router, public formBuilder: FormBuilder, public alertController: AlertController, private http: HttpClient) {
    addIcons({ personOutline, chevronBackOutline });

    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      student: [false, Validators.requiredTrue],
      teacher: [false, Validators.requiredTrue]
    }, { validators: [this.checkCheckboxes] })
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  goToSignUp() {
    this.router.navigateByUrl('cadastro');
  }

  private checkCheckboxes(group: FormGroup) {
    let checkbox1 = group.get('student')?.value;
    let checkbox2 = group.get('teacher')?.value;
    return checkbox1 !== checkbox2 ? null : { notExclusive: true };
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.isAlertOpen = false;
          }
        }
      ]
    });

    await alert.present();
    this.isAlertOpen = true;
  }


  onCheckboxChange(checkbox: string) {
    if(checkbox === 'student') {
      this.signInForm.get('teacher')?.setValue(false);
      this.signInForm.get('teacher')?.clearValidators();
      this.signInForm.get('teacher')?.updateValueAndValidity();
    } else {
      this.signInForm.get('student')?.setValue(false);
      this.signInForm.get('student')?.clearValidators();
      this.signInForm.get('student')?.updateValueAndValidity();
    }
  }

  signIn() {
    const payload = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password
    };

    if(this.signInForm.value.student) {
      this.http.post('http://localhost:3000/alunos/login', payload).subscribe({
        next: (response) => {
          this.goToHome((response as any).aluno.id, 'aluno');
        },
        error: (error) => {
          const message = 'Tente novamente';
          const title = error.error.error;
          this.showAlert(title, message);
        }
      });
    } else {
      this.http.post('http://localhost:3000/tutores/login', payload).subscribe({
        next: (response) => {
          this.goToHome((response as any).tutor.id, 'tutor');
        },
        error: (error) => {
          console.log(error)
          const message = 'Tente novamente';
          const title = error.error.error;
          this.showAlert(title, message);
        }
      });
    }

    this.isAlertOpen = true;
  }

  goToHome(id: string, status: string) {
    this.router.navigate(['/home', status, id]);
  }
}
