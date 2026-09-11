import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { youtubeExtractor } from './src/core/extractor/youtubeService';
import { AudioTrack } from './src/types/track';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testExtraction = async () => {
    setLoading(true);
    setError(null);
    setTrack(null);

    try {
      const testVideoId = '5NV6Rdv1a3I';
      const result = await youtubeExtractor.getAudioStream(testVideoId);
      setTrack(result);
    } catch (err: any) {
      setError(err?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>OrangeMusic Test Harness</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={testExtraction}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Probar Extracción On-Device</Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ Error: {error}</Text>
          </View>
        )}

        {track && (
          <ScrollView style={styles.resultBox}>
            <Text style={styles.successText}>✅ Extraído correctamente</Text>
            <Text style={styles.label}>Título: {track.title}</Text>
            <Text style={styles.label}>Artista: {track.artist}</Text>
            <Text style={styles.label}>MIME: {track.mimeType}</Text>
            <Text style={styles.label}>Bitrate: {track.bitrate} bps</Text>
            <Text style={styles.urlLabel}>URL de Stream:</Text>
            <Text style={styles.urlText} numberOfLines={4}>
              {track.streamUrl}
            </Text>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FF5500', marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#FF5500', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  errorBox: { marginTop: 20, padding: 12, backgroundColor: '#330000', borderRadius: 8 },
  errorText: { color: '#FF4444' },
  resultBox: { marginTop: 20, backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8 },
  successText: { color: '#00FF66', fontWeight: 'bold', marginBottom: 10 },
  label: { color: '#FFF', fontSize: 14, marginBottom: 4 },
  urlLabel: { color: '#888', marginTop: 10 },
  urlText: { color: '#FF5500', fontSize: 12 },
});