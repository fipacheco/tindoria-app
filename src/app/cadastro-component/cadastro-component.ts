import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  IonAlert,
  IonInput,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'cadastro',
  templateUrl: './cadastro-component.html',
  styleUrls: ['./cadastro-component.scss'],
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
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonAlert,
    IonInput
  ],
})
export class CadastroComponent implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  signUpForm: FormGroup;
  imageUrl: string = '';
  isAlertOpen = false;

  constructor(public formBuilder: FormBuilder, private http: HttpClient, public alertController: AlertController) {
    addIcons({ personOutline, chevronBackOutline });

    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      student: [false, Validators.requiredTrue],
      teacher: [false, Validators.requiredTrue]
    }, { validators: [this.confirmPasswordValidator('password', 'passwordConfirm'), this.checkCheckboxes] })
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  private confirmPasswordValidator(passwordControlName: string, confirmPasswordControlName: string) {
    return (formGroup: FormGroup): { [key: string]: any } | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('passwordConfirm')?.value;
      if (confirmPassword && password !== confirmPassword) {
        formGroup.get('passwordConfirm')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        return null;
      }
    };
  }

  private checkCheckboxes(group: FormGroup) {
    let checkbox1 = group.get('student')?.value;
    let checkbox2 = group.get('teacher')?.value;
    return checkbox1 !== checkbox2 ? null : { notExclusive: true };
  }

  private chooseImage() {
    const randonImages: string[] = [
      'assets/images/imagem1.jpg',
      'assets/images/imagem2.jpg',
      'assets/images/imagem3.jpg',
      'assets/images/imagem4.jpg',
      'assets/images/imagem5.jpg'
    ];

    const randomIndex = Math.floor(Math.random() * randonImages.length);
    this.imageUrl = randonImages[randomIndex];
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
      this.signUpForm.get('teacher')?.setValue(false);
      this.signUpForm.get('teacher')?.clearValidators();
      this.signUpForm.get('teacher')?.updateValueAndValidity();
    } else {
      this.signUpForm.get('student')?.setValue(false);
      this.signUpForm.get('student')?.clearValidators();
      this.signUpForm.get('student')?.updateValueAndValidity();
    }
  }

  signUp() {
    this.chooseImage();
    const payload = {
      name: this.signUpForm.value.name,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      imagemUrl: this.imageUrl
    };

    if(this.signUpForm.value.student) {
      this.http.post('http://localhost:3000/alunos/cadastro', payload).subscribe({
        next: (response) => {
          const message = (response as any).message;
          const title = 'Sucesso!';
          this.showAlert(title, message);
        },
        error: (error) => {
          const message = 'Tente novamente';
          const title = error.error.error;
          this.showAlert(title, message);
        }
      });
    } else {
      this.http.post('http://localhost:3000/tutores/cadastro', payload).subscribe({
        next: (response) => {
          const message = (response as any).message;
          const title = 'Sucesso!';
          this.showAlert(title, message);
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

  get enableButton() {
    return this.signUpForm.valid;
  }
}
