import { Link } from "react-router-dom";
import { imgUrl } from "../lib/tmdb";
import "../style/components/MovieCard.css";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster">
          <img 
            src={imgUrl(movie.poster_path, "w500")} 
            alt={movie.title}
            loading="lazy"
          />
          <div className="movie-overlay">
            <h3 className="movie-title-overlay">{movie.title}</h3>
            <div className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</div>
          </div>
        </div>
        
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{movie.release_date?.slice(0,4)}</span>
            <span className="movie-rating-small">⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}