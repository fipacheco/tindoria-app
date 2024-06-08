import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonContent } from "@ionic/angular/standalone";
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [IonContent, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonButton, IonTitle, IonToolbar, IonHeader, HttpClientModule ],
  templateUrl: './subject.component.html',
  providers: [ApiService],
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent  implements OnInit {
  imagemUrl: string | null = null;
  nomeDisciplina: string | null = null;
  descricao: string | null = null;
  id: string| null = null;

  constructor( private route: ActivatedRoute, public router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    if(this.id){
    this.apiService.getMateriaById(this.id).subscribe(response => {
      this.imagemUrl =  response.route;
      this.nomeDisciplina = response.name;
      this.descricao = response.description;
    })
  }
}

  goToHome() {
    const id = localStorage.getItem('userId');
    const status = localStorage.getItem('status');
    this.router.navigate(['/home', status, id]);
  }

}
