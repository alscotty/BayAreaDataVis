# BayAreaDataVis
Javascript project; data visualization of rent prices &amp; trends in the bay area

JS Project Proposal: Data Visualization of Rent Price Trends in the Bay Area

Background:
	My goal is to make a data visualization of rent prices around the bay area. For the end product, users should be able to scroll around a map, and on hovering on a certain region have line graph that displays the current avg rent for that region as well as the past 3-5 years.

Functionality & MVP:
	-scroll/browse given map region
	-price data shown for each neighborhood; colorful design
	-interactive line graph with past years & trendline for each neighborhood
	-a production README

Wireframes:
  ![wireframePic](relative/path/to/img.jpg?raw=true "wireframe")

Architecture and Technologies:
	This project will be implemented with the following technologies:
		-Leaflet and Mapbox for map rendering
		-D3 for data visualization, graphs, and interactivity
	File structure:
		-index.html, contains API scripts and D3 script, etc.
		-map.js renders map, handles logic, and renders to the DOM

Implementation Timeline:
	-Day 1: 
-Set up all needed node modules, webpack, index.html
		-get map functionality setup
		-begin data vis.
	-Day 2:
		-continue data visualization
		-add graphs, etc.
	-Day 3:
		-host to heroku, debug any outstanding issues
		-more time on css and design
