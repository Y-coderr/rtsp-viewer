import { useState } from 'react';
import PropTypes from 'prop-types';
import StreamPlayer from './StreamPlayer';

function StreamGrid({ streams, onRemoveStream, onTogglePlayPause }) {
  const [layout, setLayout] = useState('grid'); // grid, single
  const [activeStreamId, setActiveStreamId] = useState(null);

  const handleStreamClick = (id) => {
    if (layout === 'grid') {
      setLayout('single');
      setActiveStreamId(id);
    } else {
      setLayout('grid');
      setActiveStreamId(null);
    }
  };

  // Dynamic grid CSS class based on number of streams
  const getGridClass = () => {
    const count = streams.length;
    if (count === 1) return 'stream-grid-1';
    if (count === 2) return 'stream-grid-2';
    if (count === 3 || count === 4) return 'stream-grid-4';
    if (count >= 5 && count <= 6) return 'stream-grid-6';
    return 'stream-grid-many';
  };

  return (
    <div className="stream-viewer">
      <div className="stream-controls">
        <button 
          onClick={() => setLayout(layout === 'grid' ? 'single' : 'grid')}
          className="layout-toggle"
        >
          {layout === 'grid' ? 'Single View' : 'Grid View'}
        </button>
        <span>{streams.length} stream{streams.length !== 1 ? 's' : ''} active</span>
      </div>
      
      <div className={`stream-grid ${layout === 'grid' ? getGridClass() : 'stream-single-view'}`}>
        {layout === 'grid' ? (
          // Grid layout - show all streams
          streams.map(stream => (
            <StreamPlayer
              key={stream.id}
              stream={stream}
              onRemove={() => onRemoveStream(stream.id)}
              onTogglePlayPause={() => onTogglePlayPause(stream.id)}
              onClick={() => handleStreamClick(stream.id)}
            />
          ))
        ) : (
          // Single stream view - show only active stream
          streams
            .filter(stream => stream.id === activeStreamId)
            .map(stream => (
              <StreamPlayer
                key={stream.id}
                stream={stream}
                onRemove={() => onRemoveStream(stream.id)}
                onTogglePlayPause={() => onTogglePlayPause(stream.id)}
                onClick={() => handleStreamClick(stream.id)}
                isSingleView
              />
            ))
        )}
      </div>
    </div>
  );
}

StreamGrid.propTypes = {
  streams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      isPlaying: PropTypes.bool.isRequired
    })
  ).isRequired,
  onRemoveStream: PropTypes.func.isRequired,
  onTogglePlayPause: PropTypes.func.isRequired
};

export default StreamGrid;