[![Build Status](https://travis-ci.org/mb-dev/plot-my-trip.svg?branch=master)](https://travis-ci.org/mb-dev/plot-my-trip/)
[![Codeship Status for mb-dev/plot-my-trip](https://codeship.com/projects/78878510-30d1-0133-8583-026237e4ffbb/status?branch=master)](https://codeship.com/projects/99649)

Plot-my-trip is a is free, open-source trip mapping website based on Google Maps. It's my personal project and is written using Go and React.

## Goals
For the past few years, every time I plan a trip, I wished there would be a website that will allow me to plan an efficient daily route in a city. It will allow adding a bunch of locations, see where they are, re-order them, and save the list as itinerary for day 1 in Rome.

I am surprised I can't find a tool that can do it yet, since there are so many trip related websites. Therefore I decided to create one and learn Go and React in the process.

Project goals are:

- Allow creating a trip that contains cities, days and locations.
- Allow adding locations to a scrapbook and adding them to specific days.
- Allow plotting directions for a single day on the map.
- Allow viewing all locations in a city on the map.

In the code cities are called regions and days are groups.

## How to add the first city to your trip

Enter a city in the autocomplete input. For example "Rome", and a button "Add Rome as Region" will display.

## Todo:
- Add routing, so saving a trip redirects to a url with id. Allow creating more than one trip
- Add SSL
- Creating the first and subsequent regions should be made more clear
- Allow sharing a trip with friends.
- Add more authentication options.
- Allow re-order locations inside a group
- Make groups look better on the sidebar
- Allow viewing more information about a location.
- Google Maps icons can be more specific to the type of location (https://mapicons.mapsmarker.com/)
- Profile page

## To run locally
- Have MongoDB running
- npm install
- go get -t -v ./...
- gulp dev
