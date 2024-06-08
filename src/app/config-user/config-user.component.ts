import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonInput, IonButton, AlertController } from "@ionic/angular/standalone";
import { ApiService } from '../service/api.service';

@Component({
  selector: 'config-user',
  standalone: true,
  imports: [IonButton, IonInput, HttpClientModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [ApiService],
  templateUrl: './config-user.component.html',
  styleUrls: ['./config-user.component.scss'],
})
export class ConfigUserComponent  implements OnInit, OnChanges {
  editUserForm: FormGroup;
  isAlertOpen = false;

  @Input() user: any;
  @Input() status: any;
  @Output() update = new EventEmitter<boolean>();

  constructor(public formBuilder: FormBuilder, public alertController: AlertController, private apiService: ApiService) {
    this.editUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      semester: ['', [Validators.required, Validators.minLength(6)]],
      bio: [false, Validators.requiredTrue],
      url: [false, Validators.requiredTrue],
      discord: [false, Validators.requiredTrue],
      youtube: [false, Validators.requiredTrue],
      twitter: [false, Validators.requiredTrue],
      instagram: [false, Validators.requiredTrue],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if('user' in changes) {
      this.editUserForm.get('name')?.setValue(this.user?.name);
      this.editUserForm.get('semester')?.setValue(this.user?.semestre);
      this.editUserForm.get('bio')?.setValue(this.user?.bio);
      this.editUserForm.get('url')?.setValue(this.user?.linkURL);
      this.editUserForm.get('discord')?.setValue(this.user?.linkDiscord);
      this.editUserForm.get('youtube')?.setValue(this.user?.linkYoutube);
      this.editUserForm.get('twitter')?.setValue(this.user?.linkTwitter);
      this.editUserForm.get('instagram')?.setValue(this.user?.linkInstagram);
    }
  }

  ngOnInit() {
    
  }

  alunoPatch(value: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:3000/alunos/${this.user.id}`;
    this.apiService.updateAluno(this.user.id, value ).subscribe({
      next: (result) => {
        this.showAlert('Parabens', (result as any).message);
      },
      error: (error) => {
        this.showAlert('Erro', error.error.error);
      }
    })
  }

  tutorPatch(value: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:3000/tutores/${this.user.id}`;
    this.apiService.updateTutor(this.user.id, value).subscribe({
      next: (result) => {
        this.showAlert('Parabens', (result as any).message);
      },
      error: (error) => {
        this.showAlert('Erro', error.error.error);
      }
    });
  }

  updateUser() {
    let data: any;
    if(this.status === 'aluno') {
      const data = {
        name: this.editUserForm.get('name')?.value,
        semestre: this.editUserForm.get('semester')?.value,
        bio: this.editUserForm.get('bio')?.value
      }
      this.alunoPatch(data)
    } else {
      const data = {
        name: this.editUserForm.get('name')?.value,
        semestre: this.editUserForm.get('semester')?.value,
        bio: this.editUserForm.get('bio')?.value,
        linkURL: this.editUserForm.get('url')?.value,
        linkDiscord: this.editUserForm.get('discord')?.value,
        linkYoutube: this.editUserForm.get('youtube')?.value,
        linkTwitter: this.editUserForm.get('twitter')?.value,
        linkInstagram: this.editUserForm.get('instagram')?.value,
      }
      this.tutorPatch(data)
    }
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
            this.close();
          }
        }
      ]
    });

    await alert.present();
    this.isAlertOpen = true;
  }

  close() {
    this.update.emit(true);
  }


}
