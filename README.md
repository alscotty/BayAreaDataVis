# BayAreaDataVis
[BayAreaDataVis](https://alscotty.github.io/BayAreaDataVis/dist/index.html)

This project is an interactive data visualization of the (very high!) median home prices and trends in San Francisco. A 20 year data set (1996-2016) was used from Zillow, and then set as a geoJSON layer for the map, allowing for users to hover and view relevant costs for each neighborhood. On clicking a region, the D3 graph will populate with a trendline of prices.


## Technologies:
- HTML5, CSS3, Vanilla JavaScript
- Leaflet.js
- Mapbox GL
- D3.js

## Highlights
* Click event handler to display neighborhood price trendline on graph and append title as text on the DOM
```javascript
  layer.on('click', ()=>{
            let nbrhood=layer.feature.properties.nbrhood
            let item=document.getElementById(`${nbrhood}`)
            let leg = document.getElementById('legend')
            let title = document.createElement('text')
            title.innerHTML = `● ${nbrhood}`
                if (item){
                    if(item.classList.contains("hidden-line")){
                        title.style.color = item.getAttribute('stroke');
                        leg.append(title)
                        var br = document.createElement('br');
                        leg.appendChild(br)
                    }
                    item.classList.remove('hidden-line')
                }
            
        })
```
* Function to create graph, and add all line data with hidden display class
```javascript
    function emptyGraph() {
        var svgWidth = 600, svgHeight = 400;
        var margin = { top: 20, right: 20, bottom: 30, left: 60 },
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;
        var svg = d3.select('#svg').attr("width", svgWidth).attr("height", svgHeight);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleLinear()
            .range([0,width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

            y.domain([0,2000000])
            x.domain([1996,2016])
    
        let allNeighborhoods=getNeighborhoodList();
        allNeighborhoods.forEach(neighborhood=>{
            let data=formatGraphData(neighborhood);
            let line = d3.line().x((data) => { return x(data.year) })
                .y((data) => { return y(data.price) })

          
            let colors = randColorArr();

            g.append("path").datum(data).attr("fill", "none").attr("stroke", `rgb(${colors[0]},${colors[1]},${colors[2]})`).attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 4.0).attr("d", line).attr("class","hidden-line").attr("id",`${neighborhood}`);

        })

        g.append("g").attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.format("d")))
                

        g.append("g").call(d3.axisLeft(y)).append("text").attr("fill", "#000").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("Price ($)");

        svg.append("text")
            .attr("x", (width+60) / 2)
            .attr("y",20)
            .style("text-anchor", "middle")
            .text("Year vs. Median Home Price");

    }
 ```
