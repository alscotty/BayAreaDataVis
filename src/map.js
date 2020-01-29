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
        console.log(myPrices)
        return myPrices
    }


const onEachFeature = function (feature, layer) {
    layer.setStyle(regStyle);

    ((layer, properties)=> {

        var popup = L.popup('', {
            id: "popup"
        });

        let lastPrice=findprices(properties.nbrhood);
        
        popup.setContent(`${properties.nbrhood}, latest avg home price: ${lastPrice}`)
        
        var popupOptions={
            'className':'popup'
        };
        
        layer.bindPopup(popup,popupOptions);
        
        layer.on("mouseover", () => {
            layer.setStyle(highlightStyle);
            
            layer.openPopup();
        });
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