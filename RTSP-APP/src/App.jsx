import { useState, useEffect } from 'react';
import StreamForm from './components/StreamForm';
import StreamGrid from './components/StreamGrid';
import { validateRtspUrl, terminateStreamSession } from './utils/rtspUtils';
import './App.css';

function App() {
  const [streams, setStreams] = useState([]);

  const addStream = (url) => {
    const newStream = {
      id: Date.now().toString(),
      url,
      isPlaying: true,
    };
    setStreams([...streams, newStream]);
  };

  const removeStream = (id) => {
    // Find the stream to remove
    const streamToRemove = streams.find(stream => stream.id === id);
    
    // Remove the stream from the array
    setStreams(streams.filter(stream => stream.id !== id));
    
    // Clean up any resources associated with the stream
    if (streamToRemove && streamToRemove.sessionId) {
      terminateStreamSession(streamToRemove.sessionId)
        .catch(err => console.error("Error terminating stream:", err));
    }
  };

  const togglePlayPause = (id) => {
    setStreams(streams.map(stream => 
      stream.id === id ? { ...stream, isPlaying: !stream.isPlaying } : stream
    ));
  };

  return (
    <div className="rtsp-app">
      <header>
        <h1>RTSP Stream Viewer</h1>
      </header>
      <main>
        <StreamForm onAddStream={addStream} />
        {streams.length > 0 ? (
          <StreamGrid 
            streams={streams} 
            onRemoveStream={removeStream}
            onTogglePlayPause={togglePlayPause}
          />
        ) : (
          <div className="empty-state">
            <p>No streams added yet. Add an RTSP stream URL to get started.</p>
          </div>
        )}
      </main>
      <footer>
        <p>RTSP Stream Viewer © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;