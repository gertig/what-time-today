import React, { useEffect, useState } from 'react';
import MyCalendar from './components/mycalendar/MyCalendar.js';
import { handleClientLoad, handleAuthClick } from './util/auth';
import { outputToString } from './util/dateTime';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Privacy from './components/privacy/Privacy';
import About from './components/about/About';
import { copyToClipboard } from './util/util';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAvailabilities } from './redux/selectors';
import { signIn, signOut, clearAllEvents, clearCalendars, clearAvailabilities } from './redux/actions';
import { getAndDisplayEvents } from './util/gapi';
import { DropdownButton, ToggleButtonGroup, ToggleButton, Dropdown, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
// import {OverlayTrigger, Tooltip} from 'react-bootstrap'.
import './style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const moment = require('moment-timezone');

var peep1 = require('./assets/peep1.png');
var rand = Math.floor(Math.random() * 16) + 2;
var peep2 = require('./assets/peep' + rand.toString() + '.png');


var offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
var USTimeZones = ["America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York"];
var WorldWideTimeZones = ["Asia/Kolkata", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Tokyo",
  "Australia/Sydney", "Australia/Darwin", "Europe/Paris", "Europe/Berlin", "Etc/GMT"]
var AllTimeZones = [offset, ...USTimeZones.filter(tz => tz !== offset), ...WorldWideTimeZones.filter(tz => tz !== offset)].sort((a, b) => a > b);

export const messageTypes = ["Boring", "Cute", "Aggressive", "Elon", "Raw", "Inverse"];

function App() {

  const [AMPM, setAMPM] = useState(true);
  const [MonthDay, setMonthDay] = useState(true);
  const [timeZone, setTimeZone] = useState(offset);
  const [timeZones, setTimeZones] = useState(AllTimeZones.filter((tz) => tz !== offset));

  const [messageType, setMessageType] = useState(messageTypes[0]);

  const setUserCallback = (user) => {
    if (user) {
      let userProfile = user.getBasicProfile();
      let newUser = {
        firstName: userProfile.getGivenName(),
        lastName: userProfile.getFamilyName(),
        email: userProfile.getEmail(),
      }
      dispatch(signIn(newUser));
      getAndDisplayEvents(dispatch);
    } else {
      // dispatch(signOut());
    }
  }

  const authenticatedCallback = () => { }

  useEffect(() => {
    console.log("Loading client");
    handleClientLoad(setUserCallback, authenticatedCallback);
  }, []);

  useEffect(() => {
    setTimeZones(AllTimeZones.filter((tz) => tz !== timeZone));
  }, [timeZone]);

  const dispatch = useDispatch();
  const { availabilities } = useSelector(getAvailabilities);

  const classes = makeStyles({
    card: {
      borderRadius: 0,
      backgroundColor: "grey",
      color: "black",
      boxShadow: "none"
    }
  });

  function signOutOfApp() {
    dispatch(signOut());
    dispatch(clearAllEvents());
    dispatch(clearCalendars());
  }

  const handleSignClick = () => {
    // If we sign out remove events
    if (handleAuthClick()) {
      signOutOfApp();
    } else {
    }
  }

  const handleAMPMChange = (val) => {
    setAMPM(val.length !== 0);
  };

  const handleMonthDayChange = (val) => {
    setMonthDay(val.length !== 0);
  };

  var width = window.innerWidth;

  const toolbar =
    (
      <div className="copytext">
        {document.queryCommandSupported('copy') &&
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip>
                Copy to your clipboard.
        </Tooltip>
            }
          >
            <Button variant="Light" onClick={(e) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", "https://api.countapi.xyz/hit/whattime.today/copy");
              xhr.responseType = "json";
              xhr.send();
              copyToClipboard(e, 'lol', availabilities, timeZone, messageType, AMPM, MonthDay)
            }
            }>Copy</Button>
          </OverlayTrigger>
        }

        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip>
              Made a mess? This cleans it up.
        </Tooltip>
          }
        >
          <Button variant="Light" onClick={() => { dispatch(clearAvailabilities()); }}>Clear</Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip>
              Don't be rude, send it to them in <strong>their</strong> time zone.
        </Tooltip>
          }
        >
          <DropdownButton
            variant="Light"
            drop="down"
            data-flip="false"
            data-display="static"
            id="dropdown-button-drop-down" title={moment().tz(timeZone).zoneAbbr()}>
            {timeZones.sort((a, b) => a > b).map((timeZone, i) =>
              <Dropdown.Item
                key={i}
                data-display="static"
                data-flip="false"
                as="a" onClick={() => { setTimeZone(timeZone) }}>
                {width < 850 ? moment().tz(timeZone).zoneAbbr() : moment().tz(timeZone).zoneAbbr() + ' - ' + timeZone}
              </Dropdown.Item>
            )}
          </DropdownButton>
        </OverlayTrigger>

        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip>
              Don't be boring.
          </Tooltip>
          }
        >
          <DropdownButton
            variant="Light"
            drop="down"
            id="dropdown-button-drop-down" title={messageType}>
            {messageTypes.map((type) =>
              <Dropdown.Item
                as="a" onClick={() => { setMessageType(type) }}>
                {type}
              </Dropdown.Item>
            )}
          </DropdownButton>
        </OverlayTrigger>

        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip>
              Not everyone is from America.
        </Tooltip>
          }
        >
          <ToggleButtonGroup type="checkbox" defaultValue={1} onChange={handleAMPMChange}>
            <ToggleButton value={1} variant="Light">AM/PM</ToggleButton>
          </ToggleButtonGroup>

        </OverlayTrigger>

        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip>
              Again, not everyone is from America.
        </Tooltip>
          }
        >
          <ToggleButtonGroup type="checkbox" defaultValue={1} onChange={handleMonthDayChange}>
            <ToggleButton value={1} variant="Light">{
              width < 600 ? (MonthDay ? "M/D" : "D/M") : (MonthDay ? "Month/Day" : "Day/Month")
            }</ToggleButton>
          </ToggleButtonGroup>

        </OverlayTrigger>

      </div>);

  const home = (
    <div className="Body">
      <div className="Calendar">
        <MyCalendar initDate={new Date()} />
      </div>
      <div>
        <div className="below-calendar">
          <img className="peep1" src={peep1} />
          <div id="lol">
            {toolbar}
            <Card className="output-card" classes={{ root: classes.card }} variant="outlined">
              <List style={{ maxHeight: 240, overflow: 'auto' }}>
                <CardContent>
                  {outputToString(availabilities, timeZone, messageType, AMPM, MonthDay).map((out, i) => {
                    return <p key={i} style={{ textAlign: "left", fontSize: 13 }}>{out}</p>
                  })}
                </CardContent>
              </List>
            </Card>
          </div>
          {
            // width 
            <img className="peep2" src={peep2} />

          }
        </div>
      </div>
    </div>);


  return (
    <div className="App">
      {/* <div className="App-border"> */}
      <Router>
        <Header handleSignClick={handleSignClick} />
        <Switch>
          <Route path="/privacy">
            {/* <div className="otherbody"> */}
            <Privacy />
            {/* </div> */}
          </Route>

          <Route path="/about">
            {/* <div className="otherbody"> */}
            <About />
            {/* </div> */}
          </Route>

          <Route path="/">
            {home}
          </Route>
        </Switch>
        <Footer />
      </Router>
      {/* </div> */}
    </div>
  );
}

export default App;
