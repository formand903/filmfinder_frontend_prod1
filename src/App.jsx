import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const styles = {
  container: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    padding: '2rem 1rem',
    color: '#fff',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#e50914'
  },
  tutorial: {
    background: 'rgba(255,255,255,0.05)',
    padding: '1rem',
    borderRadius: '1rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '1rem',
    padding: '1rem',
    maxWidth: '400px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.5s ease',
    opacity: 1
  },
  media: {
    width: '100%',
    borderRadius: '1rem',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '0.95rem',
    color: '#ddd',
    marginTop: '1rem'
  },
  showMore: {
    color: '#e50914',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    display: 'inline-block'
  }
};

function App() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (pageToFetch = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`https://filmfinder.deta.space/proxy/tmdb?page=${pageToFetch}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.results)) {
        console.warn('Ответ API не содержит ожидаемых данных:', data);
        throw new Error('Неверный формат ответа от API');
      }
      const filtered = data.results.filter(m => m.poster_path);
      if (filtered.length > 0) {
        const mapped = filtered.map(m => ({
          title: m.title,
          year: m.release_date?.split('-')[0],
          genre: '',
          poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          overview: m.overview,
          trailer: `https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' трейлер')}`
        }));
        setMovies(prev => [...prev, ...mapped]);
        setError(null);
      } else {
        console.warn('Получены фильмы, но без постеров:', data.results);
        throw new Error('Нет доступных фильмов с постером');
      }
    } catch (err) {
      console.error('Ошибка загрузки фильма:', err);
      setError(`Не удалось загрузить фильмы. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/proxy/tmdb?page=1");
  }, [page]);

  const nextMovie = () => {
    if (index + 1 >= movies.length - 3 && !loading) {
      setPage(prev => prev + 1);
    }
    setIndex(prev => (prev + 1) % movies.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextMovie,
    onSwipedRight: nextMovie,
    onSwipedDown: nextMovie,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const movie = movies[index];

  return (
    <div style={styles.container} {...swipeHandlers}>
      <h1 style={styles.heading}>🎬 FilmFinder</h1>
      <div style={styles.tutorial}>
        <p><strong>Добро пожаловать!</strong></p>
        <p>Свайп вправо — 👍 понравился</p>
        <p>Свайп влево — 👎 не понравился</p>
        <p>Свайп вниз — ✅ уже смотрел</p>
      </div>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      <TransitionGroup>
        {movie && (
          <CSSTransition
            key={movie.title}
            timeout={500}
            classNames={{
              enter: 'fade-enter',
              enterActive: 'fade-enter-active',
              exit: 'fade-exit',
              exitActive: 'fade-exit-active'
            }}
          >
            <div style={styles.card}>
              <img src={movie.poster} alt="Постер фильма" style={styles.media} />
              <h2>{movie.title}</h2>
              <p>{movie.year}</p>
              <p style={styles.description}>{movie.overview}</p>
              <a href={movie.trailer} target="_blank" rel="noopener noreferrer" style={styles.showMore}>Смотреть трейлер</a>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
      {loading && <p style={{ marginTop: '1rem', color: '#ccc' }}>Загрузка...</p>}
    </div>
  );
}

export default App;
