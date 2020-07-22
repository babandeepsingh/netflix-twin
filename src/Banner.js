import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import YouTube from 'react-youtube';
import movieTrailer from "movie-trailer";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import './banner.scss';
function Banner() {
    const [movie, setMovie] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("");
    const [button, setButton] = useState("Play")
    const [error, setError] = useState("");
    const [ready, setReady] = useState(false)
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginal)
            console.log(request.data.results[Math.floor(Math.random() * request.data.results.length - 1)])
            setMovie(request.data.results[Math.floor(Math.random() * request.data.results.length - 1)])
            setTimeout(()=>{
                setReady(true)
            },2500)
            return request
        }
        fetchData()
    }, [])
    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + '...' : str
    }
    const handleClick = (movie) => {
        console.log(movie.name)
        if (trailerUrl) {
            setTrailerUrl("");
            setButton('Play');
        }
        else if(error){
            setError(error)
        }
        else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
                .then(url => {
                    console.log(url)
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                    console.log(urlParams.get('v'))
                    setButton('Close');
                }).catch(err => { console.log(err); setError(encodeURI(`https://www.youtube.com/results?search_query=${movie?.name || movie?.title || movie?.original_name}`)) })
        }
    }
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        }
    }
    return (
        <ReactPlaceholder style={{ padding: '50px 30px'}} ready={ready} showLoadingAnimation={true} type='media' rows={6}>
        {ready && movie && <header className="banner"
            style={{
                backgroundSize: "cover",
                backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
                backgroundPosition: "center center"
            }}
        >
            <div className="banner__contents">
                <h1 className="banner__title">
                    {movie?.name || movie?.title || movie?.original_name}
                </h1>
                <div>
                    <button className="banner__button" onClick={() => handleClick(movie)}>{button}</button>
                    <button className="banner__button">My List</button>
                </div>
                <h1 className="banner__description">
                    {truncate(movie?.overview, 150)}
                </h1>
                <div className="youtube__banner">
                    {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
                    {error && <div className="error__messages"> Sorry we couldn't find exact match. <a href={error} target="_blank">Click here to redirect direct to youtube</a></div>}
                </div>
            </div>
            {/* <div className="youtube__banner">
                {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
            </div> */}
            <div className="banner--fadeBottom" />
            {/* title */}
            {/* div>2button */}
            {/* description */}

        </header>}
        </ReactPlaceholder>
    )
}

export default Banner
