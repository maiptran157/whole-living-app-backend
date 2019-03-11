
module.exports = (app, connection) => {
    app.get("/api/getGooglePlacesData", function (req, res) {
        var key = require('./config/api_key').GOOGLE_PLACES_API_KEY;
        var axios = require('axios');
        var address = req.query.address;
        var keyPlace = req.query.keyPlace;
        var location = null;
        var urlForGeocodingAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
        var urlForGooglePlacesAPI = null;
        var searchResult = [];
        var dataToClean = [];
        //get latitude and longitude from address and call getDataFromGooglePlaces
        const getLatLngFromAddress = async () => {
            try {
                const response = await axios.get(urlForGeocodingAPI);
                if (response.statusText === "OK") {
                    location = response.data.results[0].geometry.location;
                    await getDataFromGooglePlaces();
                } else {
                    res.send(response);
                }
            }
            catch (error) {
                res.send(error);
            }
        }

        //get nearby key places
        const getDataFromGooglePlaces = async () => {
            try {
                urlForGooglePlacesAPI = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyPlace.split(" ").join("+")}&location=${location.lat},${location.lng}&radius=10000&key=${key}`;
                const response = await axios.get(urlForGooglePlacesAPI);
                if (response.statusText === "OK") {
                    searchResult = response.data.results;
                    for (let i = 0; i < searchResult.length; i++) {
                        dataToClean.push({
                            "formatted_address": searchResult[i].formatted_address,
                            "geometry__location__lat": searchResult[i].geometry.location.lat,
                            "geometry__location__lng": searchResult[i].geometry.location.lng,
                            "id": searchResult[i].id,
                            "name": searchResult[i].name
                        })
                    }
                    await res.send(dataToClean);
                } else {
                    res.send(response);
                }
            }
            catch (error) {
                res.send(error);
            }
        }

        getLatLngFromAddress();

        // const getDataFromWFMdb = (req, resp) => {
        //     connection.getConnection(function (error, tempCont) {
        //         if (!!error) {
        //             tempCont.release();
        //             console.log('Error');
        //         } else {
        //             console.log('Connected');
        //             tempCont.query("SELECT * FROM wfm_store_info", function (error, rows, field) {
        //                 tempCont.release();
        //                 if (!!error) {
        //                     console.log('Error in the query');
        //                 } else {
        //                     console.log("Successful query\n");
        //                     resp.json(rows);
        //                 }
        //             });
        //         }
        //     })
        // }

        // getDataFromWFMdb();

    });

    app.get('/api/getWFMData', function (req, resp) {
        connection.getConnection(function (error, tempCont) {
            if (!!error) {
                tempCont.release();
                console.log('Error');
            } else {
                console.log('Connected');
                tempCont.query("SELECT * FROM wfm_store_info", function (error, rows, field) {
                    tempCont.release();
                    if (!!error) {
                        console.log('Error in the query');
                    } else {
                        console.log("Successful query\n");
                        resp.json(rows);
                    }
                });
            }
        })
    });

}


