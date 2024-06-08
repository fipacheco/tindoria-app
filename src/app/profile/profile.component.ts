import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonButtons, IonButton, IonIcon, IonSearchbar, IonTabs, IonTabBar, IonTabButton, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, globeOutline, logoDiscord, logoInstagram, logoTwitter, logoYoutube, personOutline } from 'ionicons/icons';
import { SubjectsComponent } from "../subjects/subjects.component";
import { TutorsComponent } from "../tutors/tutors.component";
import { ConfigUserComponent } from "../config-user/config-user.component";
import { ApiService } from '../service/api.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    providers: [ApiService],
    styleUrls: ['./profile.component.scss'],
    imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonImg, IonContent, IonTitle, IonToolbar, IonHeader, IonLabel, IonTabButton, IonTabBar, IonTabs, CommonModule, IonButton, IonButtons, IonIcon, IonSearchbar, HttpClientModule, FormsModule, SubjectsComponent, TutorsComponent, ConfigUserComponent]
})
export class ProfileComponent  implements OnInit {
  status: string | null = null;
  public user: any;
  materiasOriginais: any;
  filteredMaterias: any[] = [];
  materias: any[] = [];
  tutoresOriginais: { id: any; name: any; imagem: any; }[] = [];
  avatars: any;
  filteredTutors: { id: any; name: any; imagem: any; }[] = [];
  tutores: any[] = [];
  selectedTab: string = 'subjects';
  showEdit = false;

  constructor(private route: ActivatedRoute, public router: Router, private apiService: ApiService) {
    addIcons({ personOutline, chevronBackOutline, globeOutline, logoDiscord, logoYoutube, logoTwitter, logoInstagram  });
  }

  ngOnInit() {
    let id = localStorage.getItem('userId');
    this.status = localStorage.getItem('status');
    if(!id) {
      this.route.paramMap.subscribe(params => {
        id = params.get('id');
        this.status = params.get('status');
        if(id && this.status){
          localStorage.setItem('userId', id);
          localStorage.setItem('status', this.status);
        }
      });
    }
    if(id) this.loadUsers(id);
  }

  carregarMaterias() {
    this.apiService.getMaterias().subscribe(
      materias => {
        this.materiasOriginais = materias.map((materia: { id: any; name: any; route: any; }) => ({
          id: materia.id,
          name: materia.name,
          imagem: materia.route
        }));
        this.filteredMaterias = [...this.materiasOriginais];
      },
      error => {
        console.error('Erro ao carregar matérias:', error);
        this.materias = [];
      }
    );
  }

  carregarTutores() {
    this.apiService.getTutores().subscribe(
      response => {
        const tutores = response.tutors;
        if (Array.isArray(tutores)) {
          this.tutoresOriginais = tutores.map(tutor =>{
            const randomIndex = Math.floor(Math.random() * this.avatars?.length);
            return ({
              id: tutor.id,
              name: tutor.name,
              imagem: this.avatars[randomIndex]
            })
          });
          this.filteredTutors = [...this.tutoresOriginais];
        } else {
          console.error('Erro ao carregar tutores: "tutors" não é um array', tutores);
          this.tutores = [];
        }
      },
      error => {
        console.error('Erro ao carregar tutores:', error);
        this.tutores = [];
      }
    );
  }

  back(){
    const id = localStorage.getItem('userId');
    const status = localStorage.getItem('status');
    this.router.navigate(['/home', status, id]);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  editProfile() {
    this.showEdit = true;
  }

  closeEdit(event: any) {
    const id = localStorage.getItem('userId');
    if(id) this.loadUsers(id)
    this.showEdit = false;
  }

  loadUsers(id: string) {
    if(this.status === 'aluno') {
      this.apiService.getAlunoById(id).subscribe(response => {
        this.user = response.aluno;
      })
      
      this.carregarMaterias();
      this.carregarTutores();
    } else {
      this.apiService.getTutorById(id).subscribe(response => {
        this.user = response.tutor;
        this.materiasOriginais = response.tutor.subjectsData?.map((materia: { id: any; name: any; route: any; }) => ({
          id: materia.id,
          name: materia.name,
          imagem: materia.route,
          
        }));
        this.filteredMaterias = [...this.materiasOriginais];
      })
    }
  }

}
