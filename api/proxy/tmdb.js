export default async function handler(req, res) {
  const { page = 1 } = req.query;

  const TMDB_API_KEY = "64caf85ec2b1fe28c66065dd95b5720c";
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка при запросе к TMDB:", error);
    res.status(500).json({ error: "Ошибка при запросе к TMDB" });
  }
}
