import React, { useEffect, useState } from 'react';
import { AppBar } from '@material-ui/core';
import './Header.css'
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button'


export default function Header(props) {
  const [counter, setCounter] = useState(0);

  const user = useSelector(state => (state.user));

  useEffect(() => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.countapi.xyz/get/whattime.today/copy");
    xhr.responseType = "json";
    xhr.onload = function () {
      setCounter(this.response.value);
    }
    xhr.send();
  }, []);


  return (
    <AppBar position="static" style={{ background: 'white', color: "black" }}>

      <div className="titlediv">

        <div className="titledivtitle">
          <Link to="/">
            <h1 className="title">
              What time today?
            </h1>
          </Link>
          <div>
            &nbsp;<p>Helped setup {counter} meetings to date! 🎉</p>
          </div>
        </div>

        <div>

          <a href="https://www.producthunt.com/posts/what-time-today?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-what-time-today" 
          target="_blank"
          >
            <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=256189&theme=light"
              alt="What Time Today? - Send time availability in seconds! | Product Hunt Embed"
              // style="width: 250px; height: 54px;"
              width={250}
              height={54} className="product-hunt"/></a>
          <div className="toolbar-buttons">

            <h3 className="title">
              {user ? "Hi, " + user.firstName + "!" : "Hi, Guest!"}
            </h3>

            {!user ? <OverlayTrigger
              placement={"bottom"}
              overlay={
                <Tooltip
                  className="overlay"
                  style={{ zIndex: 3 }}>
                  {"Imports Google Calendar events to calendar."}
                </Tooltip>
              }
            >

              <GoogleButton onClick={props.handleSignClick} />
            </OverlayTrigger>
              :
              <Button variant="Light" onClick={props.handleSignClick}>Log out</Button>
            }
          </div>
        </div>
      </div>
    </AppBar>
  );
}