import React from 'react';
import {Link} from 'react-router';

require('./welcome.less');

const WelcomePage = (props) => (
  <div id="page-content" className="welcome-page">
    <div className="about">
      <h2>Plan your next trip easily</h2>
      <img src="https://s3-us-west-1.amazonaws.com/plot-my-trip/images/PlottingTrips.png" width="807" height="535"></img>
      <ul className="story">
        <li>Enter your points of interest</li>
        <li>See where they are in the city</li>
        <li>Arrange them by day</li>
      </ul>
    </div>
  </div>
);

export default WelcomePage;
