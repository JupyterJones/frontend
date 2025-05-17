// components/PostmanVideo.jsx
import './PostmanVideo.css';

const PostmanVideo: React.FC = () => {
  return (
    <div className="youtube-containers">
      <iframe
        className="youtube-players"
        src="https://www.youtube.com/embed/Zd1t0PI-YHk"
        title="Postman Video"
        frameBorder={0}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PostmanVideo;
