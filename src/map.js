import {boundaries} from './boundaries'
import {prices} from './prices'

class Map {

constructor(){
let myMap = L.map('map-id').setView([37.773972, -122.431297], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
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
        //test to find missing neighborhood data
        // if (myPrices.length<1){console.log(neighborhood)}
        // console.log(myPrices)
     
        return myPrices
    }


    const biAnnualPrices = (neighborhood) => {
        let priceList=[`${neighborhood}`];
        prices.forEach(place => {
            if (place['Neighborhood'] == neighborhood) {
                priceList.push( '1996 '+'$'+ place.Price__1 + ' ')
                priceList.push( '1998 '+'$' + place.Price__24 + ' ')
                priceList.push( '2000 '+'$' + place.Price__48 + ' ')
                priceList.push( '2002 '+'$' + place.Price__72 + ' ')
                priceList.push( '2004 '+'$' + place.Price__96 + ' ')
                priceList.push( '2006 '+'$' + place.Price__120 + ' ')
                priceList.push( '2008 '+'$' + place.Price__144 + ' ')
                priceList.push( '2010 '+'$' + place.Price__168 + ' ')
                priceList.push( '2012 '+'$' + place.Price__192 + ' ')
                priceList.push( '2014 '+'$' + place.Price__202 + ' ')
                priceList.push( '2016 '+'$' + place.Price__225 + ' ')
            }
        });

        let graph=document.getElementById('graph');
        priceList.forEach(price=>{
            graph.append(price)
        })

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

    function emptyGraph(data) {
        var svgWidth = 600, svgHeight = 400;
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;
        var svg = d3.select('#svg').attr("width", svgWidth).attr("height", svgHeight);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleLinear().rangeRound([0, width]);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(d3.extent(data, (d) => { return d.year }));
        y.domain(d3.extent(data, (d) => { return d.price }));

        g.append("g").attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)).select(".domain").attr('dx', '0.71em', "text-anchor", "end").text("Year");

        g.append("g").call(d3.axisLeft(y)).append("text").attr("fill", "#000").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("Price ($)");

    }

    const drawChart=(data)=>{
        var svgWidth = 600, svgHeight = 400; 
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;
        var svg = d3.select('#svg').attr("width", svgWidth).attr("height", svgHeight);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleLinear().rangeRound([0, width]);
        var y = d3.scaleLinear().rangeRound([height, 0]);

        var line = d3.line().x((data)=> { return x(data.year) })
            .y((d)=> { return y(d.price) })   
                x.domain(d3.extent(data, (d) => { return d.year })); 
                y.domain(d3.extent(data, (d) => { return d.price }));

        g.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5).attr("d", line);

        
    }


const onEachFeature = (feature, layer) => {
    layer.setStyle(regStyle);
    let presidio=formatGraphData("Presidio");
    emptyGraph(presidio);

    ((layer, properties)=> {

        var popup = L.popup('', {
            id: "popup"
        });

        let lastPrice=findprices(properties.nbrhood);
        
        popup.setContent(`${properties.nbrhood}, latest avg home price (2016): ${lastPrice}`)
        
        var popupOptions={
            'className':'popup'
        };

        layer.bindPopup(popup,popupOptions);
        
        layer.on("mouseover", () => {
            layer.setStyle(highlightStyle);
            
            
            layer.openPopup();
        });
        
        layer.on('click', ()=>{
            
            // let graph=document.getElementById('graph');
            // graph.innerHTML='';
            
            // biAnnualPrices(layer.feature.properties.nbrhood);

            let data=formatGraphData(layer.feature.properties.nbrhood)
            drawChart(data);

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