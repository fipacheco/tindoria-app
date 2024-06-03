import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonContent, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'tutors',
  standalone: true,
  imports: [IonButton, IonContent, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, CommonModule],
  templateUrl: './tutors.component.html',
  styleUrls: ['./tutors.component.scss'],
})
export class TutorsComponent  implements OnInit {
  @Input() tutors: any = [];

  constructor() { }

  ngOnInit() {}

}
