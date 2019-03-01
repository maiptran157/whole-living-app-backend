
module.exports = (app, connection) => {
    app.get("/api/getGooglePlacesData", function (req, res) {
        var key = require('./config/api_key').GOOGLE_PLACES_API_KEY;
        var axios = require('axios');
        var region = req.query.region;
        var keyPlace = req.query.keyPlace;
        var url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyPlace.split(" ").join("+")}+in+${region.split(" ").join("+")}&key=${key}`;

        const getData = async () => {
            try {
                const response = await axios.get(url);
                // console.log('response:', response);
                // res.send(JSON.stringify(response.data));
            }
            catch (error) {
                console.error(error);
            }
        }

        getData();

        var respFromDb = {};

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
                        respFromDb = {
                            success: 'false',
                            error: error
                        }
                        console.log("respFromDb:", respFromDb);
                    } else {
                        console.log("Successful query\n");
                        // resp.json(rows);
                        respFromDb = {
                            success: 'true',
                            data: JSON.stringify(rows)
                        };
                        console.log("respFromDb:", respFromDb);
                    }
                });
            }
        })
    });

    // app.get('/api/getWFMData', function (req, resp) {
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
    // });

};