import { useEffect, useState } from "react";
import SearchIcon from "./search.svg";

import "./App.css";
import MovieCard from "./MovieCard";
// Here is your key: cb2555ba
const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=cb2555ba";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = async (title, page) => {
    const completeURL = API_URL + "&s=" + title + "&page=" + page;
    const response = await fetch(completeURL);
    const data = await response.json();
    setLoading(false);

    if (data.Response === "True") {
      setMovies((prevMovies) => [...data.Search, ...prevMovies]); // Use functional update
      setErrors("");
      setTotalPages(Math.ceil(data.totalResults / 10)); // Assuming 10 results per page
      console.log(movies);
    } else {
      setMovies([]);
      setErrors("Please insert a valid title");
    }
  };

  useEffect(() => {
    fetchMovies("Superman", currentPage);
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setLoading(true);
      fetchMovies(searchTerm, currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1); // Use functional update
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      setCurrentPage(1); // Reset page when new search is performed
      fetchMovies(searchTerm, 1);
    }
  };

  return (
    <div className="app">
      <h1>MovieLand</h1>
      <h4 style={{ color: "#a1a1a1" }}>
        Search the title of the movie you're interested in
      </h4>
      <div className="search">
        <input
          placeholder="Search for movie"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          onKeyDown={handleKeyPress}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => {
            setLoading(true);
            setCurrentPage(1); // Reset page when new search is performed
            fetchMovies(searchTerm);
          }}
        />
      </div>
      {loading ? (
        <div className="empty">
          <h2>Loading...</h2>
        </div>
      ) : movies.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
          {currentPage < totalPages && (
            <div className="load-more">
              <button onClick={handleLoadMore}>Load More</button>
            </div>
          )}
        </div>
      ) : (
        <div className="empty">
          <h2>{errors}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
