import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonButtons, IonButton, IonIcon, IonSearchbar, IonTabs, IonTabBar, IonTabButton, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, personOutline } from 'ionicons/icons';
import { SubjectsComponent } from "../subjects/subjects.component";
import { TutorsComponent } from "../tutors/tutors.component";
import { ApiService } from '../service/api.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    providers: [ApiService],
    styleUrls: ['./home.component.scss'],
    imports: [IonContent, IonTitle, IonToolbar, IonHeader, IonLabel, IonTabButton, IonTabBar, IonTabs, CommonModule, IonButton, IonButtons, IonIcon, IonSearchbar, HttpClientModule, FormsModule, SubjectsComponent, TutorsComponent]
})
export class HomeComponent  implements OnInit {
  materiasOriginais: any = [];
  tutoresOriginais: any = [];
  materias: any = [];
  tutores: any = [];
  searchTerm: string = '';
  filteredMaterias: any = [];
  filteredTutors: any = [];
  user: any;
  selectedTab: string = 'subjects';
  status: string | null = null;
  avatars = [
    'assets/images/av1.png',
    'assets/images/av2.png',
    'assets/images/av3.png',
    'assets/images/av4.png',
    'assets/images/av5.png',
    'assets/images/av6.png',
    'assets/images/av7.png'
  ];

  constructor(private route: ActivatedRoute, public router: Router, private apiService: ApiService) {
    addIcons({ personOutline, chevronBackOutline });
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
    if(this.status === 'aluno') {
      this.apiService.getAlunoById(this.user?.id).subscribe(response => {
        this.user = response.aluno;
      })
      
      this.carregarMaterias();
      this.carregarTutores();
    } else {
      this.apiService.getTutorById(this.user?.id).subscribe(response => {
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
            const randomIndex = Math.floor(Math.random() * this.avatars.length);
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

  filterMaterias(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if(this.selectedTab === 'subjects') {
      this.filteredMaterias = this.materiasOriginais.filter((materia: { name: string; }) => 
        materia.name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredTutors = this.tutoresOriginais.filter((tutor: { name: string; }) => 
        tutor.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  selectTab(tab: string) {
    this.searchTerm = '';
    this.filteredMaterias = this.materiasOriginais;
    this.filteredTutors = this.tutoresOriginais;
    this.selectedTab = tab;
  }

  logOut(){
    localStorage.removeItem('userId');
    localStorage.removeItem('status');
    this.router.navigate(['/']);
  }

  goToProfile(id: string, status: string) {
    this.router.navigate(['/profile', status, id]);
  }

}
