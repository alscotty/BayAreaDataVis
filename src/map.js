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
                priceList.push( '2018 '+'$' + place.Price__247 + ' ')
            }
        });

        let graph=document.getElementById('graph');
        priceList.forEach(price=>{
            graph.append(price)
        })

    }


const onEachFeature = (feature, layer) => {
    layer.setStyle(regStyle);

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
            
            biAnnualPrices(layer.feature.properties.nbrhood)

            layer.openPopup();
        });
        layer.on("mouseout", () => {
            layer.setStyle(regStyle);

            let graph=document.getElementById('graph');
            graph.innerHTML='';

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