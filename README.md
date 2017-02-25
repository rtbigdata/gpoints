# gpoints
Geospatial points mapped using MongoDB, Node, Express and Leaflet 

Demo running on Heroku platform: https://secret-earth-76587.herokuapp.com/gpoints/34.1629/-118.3123

You can deploy this to your own local or Heroku environment, or any type of server that can run node.js. You will need to get some geospatial point data and load it into MongoDB, then create a 2dsphere index on the collection.

Example commands to do this, starting from your CLI:

`mongoimport google_points.json -d geospat -c googlePoints`

Then go into the mongo shell to create the index:

`db.googlePoints.createIndex({ geometry: "2dsphere" })`

And finally, to make sure the dates and times are valid, run this command:

`db.googlePoints.find().forEach(function(doc){doc.properties.timestamp = new ISODate(doc.properties.timestamp);db.googlePoints.save(doc)});`

Pretty much any GeoJSON file containing a valid timestamp property for each feature will work fine, although if using mongoimport it  needs to be in a fairly specific JSON format.  A program such as "jq" can help in this regard.  Also you may need to modify this code since the data used in this project came from Google personal location data.  If you have an Android phone you can download every point you ever visited while your phone GPS was on and use it in this project!  Instructions on how to do that are here:  https://github.com/rtbigdata/google-location-geojson.py

If using the above Python script to process your Google location data, there is one intermediate step before running mongoimport:

`./jq --compact-output ".features[]" google_points.geojson > google_points.json`

