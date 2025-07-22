import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  // ✅ Inyectamos el servicio
  private readonly api = inject(Api);

  // ✅ Señal de personajes conectada desde el servicio
  public characters = this.api.characters;

  // ✅ Propiedades de UI
  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  // ✅ Señal computada: ¿hay personajes?
  public hasCharacters = computed(() => this.characters().length > 0);

  // ✅ Inicializa la carga al montar el componente
  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  // ✅ Carga personajes al inicio
  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getCharacters()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        error: (error) => {
          this.errorMessage = 'No se pudieron cargar los personajes. Intenta nuevamente.';
          console.error(error);
        }
      });
  }

  // ✅ Búsqueda de personajes
  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.searchCharacters(this.searchTerm)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        error: (error) => {
          this.errorMessage = 'No se encontraron personajes con ese nombre.';
          console.error(error);
        }
      });
  }

  // ✅ Detecta la tecla Enter y busca
  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
