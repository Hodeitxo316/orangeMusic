import { AudioTrack } from '../../types/track';

// @ts-ignore
import * as YouTubeJS from 'youtubei.js/bundle/react-native';

const InnertubeClass = YouTubeJS.Innertube || YouTubeJS.default?.Innertube || YouTubeJS.default;
const ClientTypeEnum = YouTubeJS.ClientType || YouTubeJS.default?.ClientType;
const Platform = YouTubeJS.Platform || YouTubeJS.default?.Platform;

class YouTubeExtractorService {
  private innertube: any = null;

  public async init(): Promise<void> {
    if (this.innertube) return;

    // Registrar el evaluador de JavaScript para descifrar las URLs de audio
    if (Platform?.shim) {
      Platform.shim.eval = async (data: any) => {
        const code = typeof data === 'string' ? data : (data?.output || data?.code || '');
        return new Function(code)();
      };
    }

    if (!InnertubeClass || typeof InnertubeClass.create !== 'function') {
      throw new Error('No se pudo cargar la clase Innertube.');
    }

    this.innertube = await InnertubeClass.create({
      client_type: ClientTypeEnum?.MUSIC || 'MUSIC',
      generate_session_locally: true,
      retrieve_player: true,
    });
  }

  public async searchTracks(query: string): Promise<Omit<AudioTrack, 'streamUrl'>[]> {
    await this.init();
    if (!this.innertube) throw new Error('Extractor no inicializado');

    const searchResults = await this.innertube.music.search(query, { type: 'song' });
    const songs = searchResults.songs?.contents || [];

    return songs.map((song: any) => {
      const id = song.id || song.video_id || '';
      return {
        id,
        title: song.title || song.name || 'Título Desconocido',
        artist: song.artists?.[0]?.name || song.author?.name || 'Artista Desconocido',
        duration: song.duration?.seconds || 0,
        artworkUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        bitrate: 0,
        mimeType: '',
      };
    });
  }

  public async getAudioStream(videoId: string): Promise<AudioTrack> {
    await this.init();
    if (!this.innertube) throw new Error('Extractor no inicializado');

    const info = await this.innertube.getBasicInfo(videoId);
    
    const format = info.chooseFormat({
      type: 'audio',
      quality: 'best',
      format: 'any',
    });

    if (!format) {
      throw new Error(`No se encontró un formato de audio válido para ${videoId}`);
    }

    const streamUrl = format.url 
      ? format.url 
      : await format.decipher(this.innertube.session.player);

    return {
      id: videoId,
      title: info.basic_info.title || 'Título Desconocido',
      artist: info.basic_info.author || 'Artista Desconocido',
      duration: info.basic_info.duration || 0,
      streamUrl,
      artworkUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      bitrate: format.bitrate || 0,
      mimeType: format.mime_type || 'audio/mp4',
    };
  }
}

export const youtubeExtractor = new YouTubeExtractorService();