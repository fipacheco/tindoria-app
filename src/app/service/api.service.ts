import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api' // URL local para desenvolvimento
    : 'https://tindoria-back-five.vercel.app/api'; // URL do seu back-end no Vercel

  constructor(private http: HttpClient) {}

  // Funções para Alunos
  getAlunos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alunos`);
  }

  loginAluno(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/alunos/login`, { email, password });
  }

  cadastrarAluno(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/alunos/cadastro`, { name, email, password });
  }

  getAlunoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/alunos/${id}`);
  }

  updateAluno(id: string, alunoData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/alunos/${id}`, alunoData);
  }

  // Funções para Tutores
  getTutores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tutores`);
  }

  loginTutor(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tutores/login`, { email, password });
  }

  cadastrarTutor(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tutores/cadastro`, { name, email, password });
  }

  getTutorById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tutores/${id}`);
  }

  updateTutor(id: string, tutorData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tutores/${id}`, tutorData);
  }

  // Funções para Materias
  getMaterias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/materias`);
  }

  getMateriaById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/materias/${id}`);
  }
}
