exports.handler = function (event, context, callback) {
    var body = event.body;

    var bodyJson;

    try {
        bodyJson = JSON.parse(body);
    } catch (e) {
        callback(null, {
            statusCode: 400,
            body: "Body is not JSON",
            headers: { "Content-Type": "text/plain" }
        });
        return false;
    }

    var schemeKeys = ["Michaels Craft Stores","Michael Phelps","Michael Jordan","Michael Rosen","Mike Posner","Michael Chaves","Michael the Archangel","Michael Schumacher","Michael J. Fox","Michael Scott","Michael Jackson","Michelangelo di Lodovico Buonarroti Simoni","Michael Cera","Michael B. Jordan","Michael Douglas","Michael Cox","Michael Myers","Michael Moore","Michael Caine","Michael Crichton","Michael Owen","Michael Bublé","Michael Corleone","Michael Paul Chan","Mike Pompeo","Michael Bay","Michael Keaton","Mike Tyson","Michael Bloomberg","Michael Bolton","Michael Pence","Michael Palin"];
    var submission = {};

    for (var i = 0; i < schemeKeys.length; i++) {
        var val = +bodyJson[schemeKeys[i]];
        if(isNaN(val)) val = 0;

        //clip to 0-5
        val = Math.min(val, 5);
        val = Math.max(val, 0);

        submission[schemeKeys[i]] = val;
    }


    var body = JSON.stringify(
        { "create": "submissions", "params": { "object": { "data": { "object": submission } } } }
    );


    var https = require("https");

    const options = {
        hostname: "db.fauna.com",
        path: "/",
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.FAUNA_API, 'Content-Length': Buffer.byteLength(body) },
    }

    console.log(options);

    var req = https.request(options, function (res) {
        res.setEncoding("utf8");

        var body = "";

        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("close", function () {
            var resJson = JSON.parse(body);
            
            if (resJson.errors) {
                callback(null, {
                    statusCode: 201,
                    body: JSON.stringify(resJson.errors),
                    headers: { "Content-Type": "application/json" }
                });
                console.error(resJson);
                return;
            } else {
                callback(null, {
                    statusCode: 201,
                    body: "Submitted",
                    headers: { "Content-Type": "text/plain" }
                });
            }
        });
    });

    req.on("error", function (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: err.message,
            headers: { "Content-Type": "text/plain" }
        });
    });

    req.end(body);
}