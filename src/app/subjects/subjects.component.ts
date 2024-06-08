import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'subjects',
  standalone: true,
  imports: [IonContent, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, CommonModule],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent  implements OnInit {
  @Input() subjects: any = [];

  constructor(public router: Router) { }

  ngOnInit() {}

  goToSubject(id: string) {
    this.router.navigate(['/subject', id]);
  }


}
