import React, { useRef, useState } from 'react';
import { useParkingStore } from '../../store/parkingStore';
import { translations } from '../../i18n/translations';
import { Button } from '../atoms/Button';
import { Camera, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CameraModal: React.FC = () => {
  const { isCameraModalOpen, setCameraModalOpen, updatePhotoUrl, language } = useParkingStore();
  const t = translations[language];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  if (!isCameraModalOpen) return null;

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch {
      alert("Kamera erişimi sağlanamadı. Fotoğraf yükleme alanını kullanabilirsiniz.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      updatePhotoUrl(dataUrl);
      stopCamera();
      setCameraModalOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updatePhotoUrl(reader.result);
          setCameraModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    stopCamera();
    setCameraModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white rounded-3xl p-5 border-[0.5px] border-slate-200 shadow-2xl relative"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <span>{t.addPhotoBtn}</span>
          </h3>
          <p className="text-xs font-semibold text-slate-500 mb-4">
            Otopark kolonu veya numarayı hızlıca çekin/yükleyin.
          </p>

          {isCameraActive ? (
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black border border-slate-800">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <Button fullWidth onClick={handleCapturePhoto} variant="primary-emerald">
                  Fotoğrafı Çek 📸
                </Button>
                <Button onClick={stopCamera} variant="outline" size="md">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                fullWidth
                onClick={startCamera}
                variant="primary-emerald"
                size="lg"
                leftIcon={<Camera className="w-5 h-5" />}
              >
                Kamerayı Aç & Çek
              </Button>

              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  fullWidth
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="lg"
                  leftIcon={<ImageIcon className="w-5 h-5 text-slate-600" />}
                >
                  Galeriden Fotoğraf Seç
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
