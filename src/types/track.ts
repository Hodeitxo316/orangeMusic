export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // Duración en segundos
  streamUrl: string; // URL directa extraída
  artworkUrl: string; // Portada HD (maxresdefault)
  bitrate: number; // Bitrate de la pista (bps)
  mimeType: string; // Formato (audio/mp4, audio/webm)
}