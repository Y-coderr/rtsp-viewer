/**
 * Utility functions for working with RTSP streams
 * 
 * Note: In a real implementation, these functions would interact with a backend
 * service that can handle RTSP streams and convert them to a format compatible
 * with web browsers, such as HLS or WebRTC.
 */

/**
 * Validates an RTSP URL format
 * @param {string} url - The RTSP URL to validate
 * @returns {boolean} - Whether the URL is a valid RTSP format
 */
export function validateRtspUrl(url) {
    // Basic validation - should start with rtsp://
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    return url.trim().toLowerCase().startsWith('rtsp://');
  }
  
  /**
   * Formats an RTSP URL for display by truncating if too long
   * @param {string} url - The RTSP URL to format
   * @param {number} maxLength - Maximum length before truncating
   * @returns {string} - Formatted URL for display
   */
  export function formatRtspUrlForDisplay(url, maxLength = 40) {
    if (!url || typeof url !== 'string') {
      return '';
    }
    
    if (url.length <= maxLength) {
      return url;
    }
    
    // Keep the protocol and beginning part
    const protocolEnd = url.indexOf('://') + 3;
    const beginning = url.substring(0, protocolEnd);
    
    // Calculate how much of the remaining URL we can show
    const availableChars = maxLength - beginning.length - 3; // 3 for the "..."
    const end = url.substring(url.length - availableChars);
    
    return `${beginning}...${end}`;
  }
  
  /**
   * In a real implementation, this function would request the backend
   * to convert the RTSP stream to a web-compatible format
   * @param {string} rtspUrl - The RTSP URL to convert
   * @returns {Promise<string>} - URL to the web-compatible stream
   */
  export async function getWebCompatibleStreamUrl(rtspUrl) {
    // This is a mock implementation for the frontend demo
    // In a real app, this would make an API call to your backend
    
    return new Promise((resolve, reject) => {
      // Simulate network request
      setTimeout(() => {
        if (validateRtspUrl(rtspUrl)) {
          // In a real implementation, this would return a URL to an HLS or WebRTC stream
          // For demo purposes, we're just returning a success response
          resolve({ 
            success: true,
            streamUrl: '/placeholder-video.mp4', // This would be a real URL in production
            sessionId: 'mock-session-' + Date.now()
          });
        } else {
          reject(new Error('Invalid RTSP URL format'));
        }
      }, 1000);
    });
  }
  
  /**
   * In a real implementation, this function would tell the backend
   * to stop streaming and clean up resources
   * @param {string} sessionId - The session ID to terminate
   * @returns {Promise<void>}
   */
  export async function terminateStreamSession(sessionId) {
    // This is a mock implementation for the frontend demo
    // In a real app, this would make an API call to your backend
    
    return new Promise((resolve) => {
      // Simulate network request
      setTimeout(() => {
        console.log(`Stream session ${sessionId} terminated`);
        resolve({ success: true });
      }, 300);
    });
  }