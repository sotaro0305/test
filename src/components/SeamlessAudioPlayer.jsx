import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const SeamlessAudioPlayer = () => {
  // 実際の音楽トラックリスト
  const tracks = [
    { id: 1, title: "Couper le vent (Loop 1)", url: "/audio/Couper_le_vent_loop1.mp3" },
    { id: 2, title: "Couper le vent (Loop 2)", url: "/audio/Couper_le_vent_loop2.mp3" },
    { id: 3, title: "Flip Up (Loop 1)", url: "/audio/Flip_Up_loop1.mp3" },
    { id: 4, title: "Flip Up (Loop 2)", url: "/audio/Flip_Up_loop2.mp3" },
    { id: 5, title: "Flip Up (Loop 3)", url: "/audio/Flip_Up_loop3.mp3" },
    { id: 6, title: "Madoromi Chronoscope", url: "/audio/Madoromi_Chronoscope_loop.mp3" },
    { id: 7, title: "Refreqt (No Percussion)", url: "/audio/Refreqt_loop1_no_percussion.mp3" },
    { id: 8, title: "Refreqt", url: "/audio/Refreqt_loop1.mp3" },
    { id: 9, title: "Sesquifractal (Loop 1)", url: "/audio/Sesquifractal_loop1.mp3" },
    { id: 10, title: "Sesquifractal (Loop 2)", url: "/audio/Sesquifractal_loop2.mp3" },
    { id: 11, title: "Sesquifractal (Loop 3)", url: "/audio/Sesquifractal_loop3.mp3" }
  ];

  const [currentTrack, setCurrentTrack] = useState(null);
  const [nextTrack, setNextTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const nextAudioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (nextTrack) {
        setCurrentTrack(nextTrack);
        setNextTrack(null);
        setIsPlaying(true);
      } else {
        // ループ再生の場合は同じ曲を最初から再生
        audio.currentTime = 0;
        audio.play();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [nextTrack]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTrackSelect = (track) => {
    if (!currentTrack) {
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      setNextTrack(track);
    }
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">トラックリスト</h2>
        <div className="space-y-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className={`w-full p-2 text-left rounded ${
                track.id === currentTrack?.id
                  ? 'bg-blue-500 text-white'
                  : track.id === nextTrack?.id
                  ? 'bg-blue-200'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {track.title}
              {track.id === nextTrack?.id && ' (次の曲)'}
            </button>
          ))}
        </div>
      </div>

      {currentTrack && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{currentTrack.title}</h3>
            <div className="flex space-x-2">
              {isPlaying ? (
                <button
                  onClick={handlePause}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Pause className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Play className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={currentTrack?.url}
        autoPlay={isPlaying}
      />
    </div>
  );
};

export default SeamlessAudioPlayer;