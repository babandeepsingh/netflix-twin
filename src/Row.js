import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from './axios';
import './row.scss';
import YouTube from 'react-youtube';
import movieTrailer from "movie-trailer";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [error, setError] = useState("");
    const [vote, setVote] = useState(0);
    const [adult, setAdult] = useState();
    const [ready, setReady] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            setTimeout(() => {
                setReady(true)
            }, 2500)
            return request
        }
        fetchData();
    }, [fetchUrl])
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {

            autoplay: 1,
        }
    }
    const loopData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const base_url = "https://image.tmdb.org/t/p/original"
    const handleClick = (movie) => {
        console.log(movie.name)
        if (trailerUrl) {
            setTrailerUrl("");
        }
        else if (error) {
            setError("")
        }
        else if (vote) {
            setVote(0)
        }
        else if (adult) {
            setAdult()
        }
        else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
                .then(url => {
                    console.log(url)
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                    setVote(movie.vote_average);
                    setAdult(movie.adult)
                    console.log(urlParams.get('v'))
                }).catch(err => { console.log(err); setError(encodeURI(`https://www.youtube.com/results?search_query=${movie?.name || movie?.title || movie?.original_name}`)) })
        }
    }
    return (
        <div className="row">
            {/* Title */}
            <h2>{title}</h2>
            {/* container -> posters */}
            <div className={`row__posters`}>
                <div className="row_desktop">
                    {loopData.map((loop) => (
                        <ReactPlaceholder  className="row__poster" ready={ready} showLoadingAnimation={true} type='rect' color='#E0E0E0' style={{ height: '200px', width: '200px' }}>
                            {"   "}
                        </ReactPlaceholder>
                    ))}
                </div>
                <div className="mobile-only">
                    {loopData.map((loop) => (
                        <ReactPlaceholder className="row__poster" ready={ready} showLoadingAnimation={true} type='rect' color='#E0E0E0' style={{ height: '200px', width: '200px' }}>
                            {"   "}
                        </ReactPlaceholder>
                    ))}
                </div>
                {movies && ready && movies.map((movie) => (
                    <img key={movie.id} className={`row__poster ${isLargeRow && 'row__posterLarge'}`} src={`${base_url}${isLargeRow ? movie.poster_path : movie?.backdrop_path || movie?.poster_path}`} alt={movie?.name || movie?.original_title} onClick={() => handleClick(movie)} />
                ))}
            </div>
            {/* {trailerUrl && (<YouTube videoId={trailerUrl} opts={opts} />)} */}
            <div className="youtube__banner">
                {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
                {error && <div className="error__messages"> Sorry we couldn't find exact match. <a href={error} target="_blank">Click here to redirect direct to youtube</a></div>}
                <div className="video__detaials">{vote !== 0 && <div>Rating: {vote}/10 Audiance: {adult ? 'A' : 'U/A'}</div>}</div>
            </div>
        </div>
    )
}

export default Row