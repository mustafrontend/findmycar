import React, { useRef, useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { Button } from '../atoms/Button';
import { soundService } from '../../services/soundService';
import { Mic, Square, Play, Trash2, Volume2 } from 'lucide-react';

export const VoiceMemoRecorder: React.FC = () => {
  const { currentSpot, updateAudioUrl } = useParkingStore();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!currentSpot) return null;

  const startRecording = async () => {
    try {
      soundService.playClickSound();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            updateAudioUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto stop after 7 seconds max
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 7000);
    } catch {
      alert("Mikrofon izni verilmedi veya ses kaydı desteklenmiyor.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      soundService.playSaveSuccessSound();
    }
  };

  const togglePlayback = () => {
    if (!currentSpot.audioUrl) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(currentSpot.audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const deleteAudio = () => {
    updateAudioUrl('');
    setIsPlaying(false);
  };

  return (
    <div className="pt-2 border-t border-slate-100">
      {currentSpot.audioUrl ? (
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/80 border-[0.5px] border-emerald-200">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span className="text-xs font-black text-emerald-950">Sesli Not Kaydedildi 🎙️</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="primary-emerald"
              onClick={togglePlayback}
              leftIcon={isPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            >
              {isPlaying ? 'Durdur' : 'Dinle 🔊'}
            </Button>
            <button
              onClick={deleteAudio}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <Button
          fullWidth
          size="sm"
          variant={isRecording ? 'primary-rose' : 'outline'}
          onClick={isRecording ? stopRecording : startRecording}
          leftIcon={
            isRecording ? (
              <Square className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Mic className="w-4 h-4 text-rose-600" />
            )
          }
          className={isRecording ? 'animate-pulse' : ''}
        >
          {isRecording ? 'Kaydı Bitir (Max 7 sn)' : 'Hızlı Sesli Not Kaydet 🎙️'}
        </Button>
      )}
    </div>
  );
};
