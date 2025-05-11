import { useEffect, useRef, useState } from 'react';
import { Play, Pause, X, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { formatRtspUrlForDisplay, getWebCompatibleStreamUrl, terminateStreamSession } from '../utils/rtspUtils';

function StreamPlayer({ stream, onRemove, onTogglePlayPause, onClick, isSingleView = false }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [webStreamUrl, setWebStreamUrl] = useState(null);

  useEffect(() => {
    // Connect to the RTSP stream via our backend service
    async function connectToStream() {
      setLoading(true);
      setError(null);
      
      try {
        // Convert RTSP to web-compatible format
        const result = await getWebCompatibleStreamUrl(stream.url);
        setWebStreamUrl(result.streamUrl);
        setSessionId(result.sessionId);
        setLoading(false);
      } catch (err) {
        console.error("Error connecting to stream:", err);
        setError("Failed to connect to stream: " + err.message);
        setLoading(false);
      }
    }
    
    connectToStream();
    
    // Clean up when component unmounts
    return () => {
      // Terminate the stream session if it exists
      if (sessionId) {
        terminateStreamSession(sessionId).catch(err => {
          console.error("Error terminating stream session:", err);
        });
      }
    };
  }, [stream.url]);

  // Handle play/pause state
  useEffect(() => {
    if (videoRef.current) {
      if (stream.isPlaying) {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
          setError("Failed to play stream. Please try again.");
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [stream.isPlaying]);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handlePlayPauseClick = (e) => {
    e.stopPropagation();
    onTogglePlayPause();
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div 
      className={`stream-container ${isSingleView ? 'single-view' : ''}`}
      onClick={onClick}
    >
      {loading ? (
        <div className="stream-loading">
          <div className="loader"></div>
          <p>Connecting to stream...</p>
        </div>
      ) : error ? (
        <div className="stream-error">
          <p>{error}</p>
          <button onClick={handleRemoveClick} className="retry-btn">Remove Stream</button>
        </div>
      ) : (
        <>
          {/* In a real implementation, this would be replaced with your RTSP player component */}
          {/* For now, we're using a regular video element as a placeholder */}
          <video 
            ref={videoRef}
            className="stream-video"
            muted={muted}
            autoPlay={stream.isPlaying}
            playsInline
          >
            {/* Use the web-compatible stream URL from our utility function */}
            <source src={webStreamUrl || "/placeholder-video.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="stream-overlay">
            <div className="stream-info">
              <span className="stream-url">{formatRtspUrlForDisplay(stream.url, 40)}</span>
            </div>
            
            <div className="stream-controls-overlay">
              <button 
                className="control-btn play-pause-btn" 
                onClick={handlePlayPauseClick}
                title={stream.isPlaying ? "Pause" : "Play"}
              >
                {stream.isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button 
                className="control-btn mute-btn" 
                onClick={toggleMute}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <button 
                className="control-btn remove-btn" 
                onClick={handleRemoveClick}
                title="Remove stream"
              >
                <X size={20} />
              </button>
              
              <button 
                className="control-btn fullscreen-btn" 
                onClick={onClick}
                title={isSingleView ? "Grid View" : "Fullscreen"}
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StreamPlayer;