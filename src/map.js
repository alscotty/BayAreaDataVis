import {boundaries} from './boundaries'
import {prices} from './prices'
import {randColorArr} from './extra_functions'

class Map {

constructor(){
    var mapOptions = {
    };

let myMap = L.map('map-id',mapOptions).setView([37.773972, -122.431297], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYWxzY290dHkiLCJhIjoiY2s0a3V2M3g1MmE4bTNubXc2eWYyb3c0aCJ9.lp7V9SIcH32Y4jgXH7VWUw'
}).addTo(myMap);


let regStyle={
    color: 'blue',
    fillOpacity: 0.2
};

let highlightStyle={
    color: 'darkblue',
    fillOpacity:0.6,

}

    const findprices=(neighborhood)=>{
        let myPrices = [];
        prices.forEach(place => {
            if (place['Neighborhood'] == neighborhood) {
                myPrices.push('$' + place.Price__247)
            }
        });
     
        return myPrices
    }


    const formatGraphData= (neighborhood) =>{
        let dataPairs=[]
        prices.forEach(place => {
            if (place['Neighborhood'] == neighborhood) {
              dataPairs.push({year: 1996, price: place.Price__1})
              dataPairs.push({year: 1998, price: place.Price__24})
              dataPairs.push({year: 2000, price: place.Price__48})
              dataPairs.push({year: 2002, price: place.Price__72})
              dataPairs.push({year: 2004, price: place.Price__96})
              dataPairs.push({year: 2006, price: place.Price__120})
              dataPairs.push({year: 2008, price: place.Price__144})
              dataPairs.push({year: 2010, price: place.Price__168})
              dataPairs.push({year: 2012, price: place.Price__192})
              dataPairs.push({year: 2014, price: place.Price__202})
              dataPairs.push({year: 2016, price: place.Price__225})
            }
        });
        return dataPairs;
    }

    const getNeighborhoodList = () => {
        let allNeighborhoods = []
        prices.forEach(place => {
            allNeighborhoods.push(place.Neighborhood)
        });
        return allNeighborhoods
    }

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

emptyGraph();

const onEachFeature = (feature, layer) => {
    layer.setStyle(regStyle);
  
    ((layer, properties)=> {

        var popup = L.popup('', {
            id: "popup"
        });

        let lastPrice=findprices(properties.nbrhood);
        
        popup.setContent(`${properties.nbrhood}, Avg. Home Price (2016): ${lastPrice}`)
        
        var popupOptions={
            'className':'popup',
            'autoPan': 'false'
        };

        layer.bindPopup(popup,popupOptions);
        
        layer.on("mouseover", () => {
            layer.setStyle(highlightStyle);
            
            layer.openPopup();
        });
        
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

        layer.on("mouseout", () => {
            layer.setStyle(regStyle);


            layer.closePopup();
        });
    })(layer, feature.properties);
};

L.geoJSON(boundaries, {
    onEachFeature: onEachFeature
}).addTo(myMap);

}


}

export default Map;


// const drawChart = (data) => {
//     var svgWidth = 600, svgHeight = 400;
//     var margin = { top: 20, right: 20, bottom: 30, left: 50 },
//         width = svgWidth - margin.left - margin.right,
//         height = svgHeight - margin.top - margin.bottom;
//     var svg = d3.select('#svg').attr("width", svgWidth).attr("height", svgHeight);
//     var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//     var x = d3.scaleLinear().rangeRound([0, width]);
//     var y = d3.scaleLinear().rangeRound([height, 0]);

//     var line = d3.line().x((data) => { return x(data.year) })
//         .y((d) => { return y(d.price) })
//     x.domain(d3.extent(data, (d) => { return d.year }));
//     y.domain(d3.extent(data, (d) => { return d.price }));

//     g.append("g").attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x)).select(".domain").attr('dx', '0.71em', "text-anchor", "end").text("Year");

//     g.append("g").call(d3.axisLeft(y)).append("text").attr("fill", "#000").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("Price ($)");

//     g.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5).attr("d", line);


// }