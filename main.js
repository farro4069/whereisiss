// Global instantiate variables
var issLocation = [0, 0];
var issNow = L.latLng(0, 0);
const brisbane = L.latLng(-27.5, 153.00);
var distanceToBrisbane = 10000;
var whenToBrisbane = 91;

// const perth = [-31.9, 115.85];
// const cairns  = [-16.9, 145.8];
// const cityLine = [brisbane, cairns, perth];

const mymap = L.map('issMap').setView([10, 0], 2);
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>, Web design &copy; <a href="file:///Users/Paul/Projects/html/dev_tools/index.html">Poor Giraffe</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
const issIcon = L.icon({
    iconUrl: 'ISS_32.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});
const marker = L.marker([80, 110], {icon: issIcon}).addTo(mymap);
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';
var issPath = [[0, 0]];

function traceLine(longitude, issLocation) {
	if(longitude > 179.0) {
		issPath = [[0, 0]];	
		console.log(issPath);
		console.log(longitude) 
	} else {
		issPath.push(issLocation);
	};
	issTrace = issPath.slice(1);
	const myLines = [{
	    "type": "LineString",
	    "coordinates": issTrace
	}];
	const myStyle = {
	    "color": "#ff7800",
	    "weight": 1,
	    "opacity": 0.5
	};
	L.polyline(issTrace, {style: myStyle}).addTo(mymap);
};

function distanceIss(latitude, longitude, velocity) {
	issNow = L.latLng(latitude, longitude);
	distanceToBrisbane = brisbane.distanceTo(issNow) / 1000;
	//92.68 minutes 
	if( longitude > 153 ) {
		whenToBrisbane = 92.68 - distanceToBrisbane / velocity * 60;
	} else {
		if( longitude < -27 ) {
			whenToBrisbane = 92.68 - distanceToBrisbane / velocity * 60;
		} else {
			whenToBrisbane = distanceToBrisbane / velocity * 60;
		}
	};

	distanceToBrisbane = distanceToBrisbane.toLocaleString(undefined, { maximumFractionDigits: 0 });
	whenToBrisbane = whenToBrisbane.toLocaleString(undefined, {maximumFractionDigits: 0 });

	document.getElementById('bris').textContent = distanceToBrisbane;
	document.getElementById('brisWhen').textContent = whenToBrisbane;

}

async function getISS() {
	const response = await fetch(api_url);
	const dataISS = await response.json();
	// console.log(dataISS);
	// Javascript destructuring converts 'dataISS.latitude' into a const named 'latitude'
	const { latitude, longitude, altitude, velocity } = dataISS;
	issLocation = [latitude, longitude];
	marker.setLatLng(issLocation);
	
	document.getElementById('lat').textContent = latitude.toFixed(2);
	document.getElementById('lon').textContent = longitude.toFixed(2);
	document.getElementById('alt').textContent = altitude.toFixed(0);

	traceLine(longitude, issLocation);
	distanceIss(latitude, longitude, velocity);
};

getISS();
setInterval(getISS, 2000); 

