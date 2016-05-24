[![Codeship Status for mb-dev/plot-my-trip](https://codeship.com/projects/78878510-30d1-0133-8583-026237e4ffbb/status?branch=master)](https://codeship.com/projects/99649)

Plot-my-trip is a is free, open-source trip mapping webapp based on Google Maps. 
It's my personal project and is written using Go and React.

## Background
Every time I planned a trip I found myself searching every location in Google Maps, 
and then using Directions mode to add a few of them together and see in which order to visit them to plan an efficient daily route. 
The issue with Google Maps is that there's no easy way to save the locations in directions mode and have an easy way to return back to them for revisions.

So I wished there was a website, that allowed me to add locations, see where they are on the map, re-order them, and save the list as a day 1 itinerary in a city.
When I couldn't find one, I decided to write this website and learn Go and React in the process.

## Goals
- Allow creating a trip that contains multiple cities, days and locations.
- Allow adding locations to a scrapbook
- Allow moving locations from the scrapbook to specific days.
- Allow plotting directions for a single day on the map.

## Code
- In the code cities are called regions and days are groups.

## TODO:
- Add SSL
- Allow sharing a trip with friends.
- Add more authentication options.
- Allow viewing more information about a location.
- Google Maps icons can be more specific to the type of location (https://mapicons.mapsmarker.com/)
- Profile page

## To run locally
- Have MongoDB running
- npm install
- go get -t -v ./...
- gulp dev
