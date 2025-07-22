import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, Character } from '../models/character';
import { Signal, WritableSignal, computed } from '@angular/core/';

@Injectable({
  providedIn: 'root'
})
export class Api {
  // ✅ URL base de la API
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  // ✅ Inyección de HttpClient
  private readonly http = inject(HttpClient);

  // ✅ Señal para manejar el estado de los personajes
  private charactersSignal: WritableSignal<Character[]> = signal([]);

  // ✅ Exposición pública de solo lectura
  public readonly characters: Signal<Character[]> = this.charactersSignal.asReadonly();

  // ✅ Obtener todos los personajes
  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap((response) => this.charactersSignal.set(response.results))
    );
  }

  // ✅ Buscar personajes por nombre
  searchCharacters(name: string): Observable<ApiResponse> {
    const trimmedName = name.trim();
    
    if (trimmedName === '') {
      return this.getCharacters();
    }

    const searchUrl = `${this.API_URL}?name=${encodeURIComponent(trimmedName)}`;
    
    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap((response) => this.charactersSignal.set(response.results))
    );
  }
}
