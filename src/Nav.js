import React, { useEffect, useState } from 'react'
import './nav.scss'

function Nav() {

    const [show, handleShow] = useState(false);
    useEffect(()=>{
        window.addEventListener("scroll", () => {
            if(window.scrollY>100){
                handleShow(true)
            }
            else{
                handleShow(false)
            }
        }) 
        return () => {
            window.removeEventListener("scroll");
        }
    },[])
    return (
        <div className={`nav ${show && "nav__black"}`}>
            <img className="nav__logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/799px-Netflix_2015_logo.svg.png" alt="netflix-logo"/>
            <img className="nav__avatar" src="https://pbs.twimg.com/profile_images/1240119990411550720/hBEe3tdn_400x400.png" alt="Login"/>
        </div>
    )
}

export default Nav
