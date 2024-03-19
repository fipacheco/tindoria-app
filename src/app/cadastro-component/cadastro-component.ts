import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    HttpClientModule
  ],
})
export class CadastroComponent implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  signUpForm: FormGroup;
  imageUrl: string = '';

  constructor(public formBuilder: FormBuilder, private http: HttpClient) {
    addIcons({ personOutline, chevronBackOutline });

    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      student: [false, Validators.requiredTrue],
      teacher: [false, Validators.requiredTrue]
    }, { validator: this.checkPasswords })
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  private checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;

    return pass === confirmPass ? null : { notSame: true }
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

  onCheckboxChange(checkbox: string) {
    if(checkbox === 'student') {
      this.signUpForm.get('teacher')?.setValue(false);
    } else {
      this.signUpForm.get('student')?.setValue(false);
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
    console.log(payload)

    this.http.post('http://localhost:3000/alunos/cadastro', payload).subscribe({
      next: (response) => {
        console.log('Resposta do servidor:', response);
        // Tratar a resposta conforme necessário
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
        // Tratar erros conforme necessário
      }
    });
  }
}
