export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string; // URL de la imagen
}

export interface ApiResponse {
  results: Character[];
}
