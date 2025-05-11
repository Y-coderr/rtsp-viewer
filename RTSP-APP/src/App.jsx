import { useState } from 'react';
import StreamForm from './components/StreamForm';
import StreamGrid from './components/StreamGrid';
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
    setStreams(streams.filter(stream => stream.id !== id));
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