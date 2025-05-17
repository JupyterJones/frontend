// components/YouTubeVideo.jsx

import './YouTubeVideo.css';

const YouTubeVideo: React.FC = () => {
  return (
    <div className="youtube-container">
      <iframe
        className="youtube-player"
        src="https://www.youtube.com/embed/bt_i7sQgqEs"
        title="YouTube Video"
        frameBorder={0}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
