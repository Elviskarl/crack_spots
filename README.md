# Crack-spots

Crack-spots is a web application that allows users to report faulty road infrastructure using geotagged images and view those reports on an interactive map.

## About the Project

Road infrastructure issues such as potholes, cracks, and damaged signage often go unnoticed until they become serious safety risks. Crack-spots provides a simple way for anyone to document these problems by uploading a photo and confirming its location.  
Each report is displayed on a Leaflet map to create a shared, visual record of road conditions.

## Features (v1.0)

- Upload images directly from a phone or computer
- Automatic extraction of GPS location from geotagged photos
- Interactive map displaying all submitted reports
- Marker popups with image preview and details

## How It Works

1. Take or upload a photo of a road issue
2. Verify the detected location on the map
3. Add a short description and submit
4. View the report instantly on the map alongside others

## Tech Stack

- React
- Leaflet
- JavaScript
- CSS
- Node/Express (backend)

## Installation

```bash
git clone https://github.com/Elviskarl/crack_spots.git
cd crack-spots
npm install
npm run dev
```
## New in v1.1.0
- Debounced street search with autocomplete
- Fly-to functionality for matching reports
- Marker clustering for improved map readability
- Refactored map and context logic

## Changelog
### v1.1.0
- Added debounced search
- Refactored map logic and context
- Improved UX with marker fly-to and popups