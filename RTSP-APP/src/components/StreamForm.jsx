import { useState } from 'react';
import PropTypes from 'prop-types';
import { validateRtspUrl } from '../utils/rtspUtils';

function StreamForm({ onAddStream }) {
  const [streamUrl, setStreamUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation for RTSP URL
    if (!streamUrl) {
      setError('Please enter a stream URL');
      return;
    }
    
    // Use validateRtspUrl utility function for validation
    if (!validateRtspUrl(streamUrl)) {
      setError('URL must be a valid RTSP stream starting with rtsp://');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Add the stream
    onAddStream(streamUrl);
    
    // Reset form
    setStreamUrl('');
  };

  return (
    <div className="stream-form-container">
      <form onSubmit={handleSubmit} className="stream-form">
        <div className="form-group">
          <label htmlFor="stream-url">RTSP Stream URL:</label>
          <div className="input-group">
            <input
              type="text"
              id="stream-url"
              placeholder="rtsp://example.com/stream"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className={error ? 'error' : ''}
            />
            <button type="submit" className="add-btn">Add Stream</button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
      <div className="example-urls">
        <p className="example-note">Example RTSP URLs:</p>
        <ul>
          <li>rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4</li>
          <li>rtsp://demo:password@ipvmdemo.dyndns.org:5541/onvif-media/media.amp</li>
        </ul>
      </div>
    </div>
  );
}

StreamForm.propTypes = {
  onAddStream: PropTypes.func.isRequired
};

export default StreamForm;