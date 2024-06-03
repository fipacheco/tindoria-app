import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [IonContent, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonButton, IonTitle, IonToolbar, IonHeader, HttpClientModule ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent  implements OnInit {
  imagemUrl: string | null = null;
  nomeDisciplina: string | null = null;
  descricao: string | null = null;
  id: string| null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.http.get<any>(`http://localhost:3000/materias/${this.id}`).subscribe(response => {
      this.imagemUrl =  response.route;
      this.nomeDisciplina = response.name;
      this.descricao = response.description;
    })
  }

  goToHome() {
    const id = localStorage.getItem('userId');
    const status = localStorage.getItem('status');
    this.router.navigate(['/home', status, id]);
  }

}
