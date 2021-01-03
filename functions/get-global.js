exports.handler = function (event, context, callback) {

    var schemeKeys = ["Michaels Craft Stores","Michael Phelps","Michael Jordan","Michael Rosen","Mike Posner","Michael Chaves","Michael the Archangel","Michael Schumacher","Michael J. Fox","Michael Scott","Michael Jackson","Michelangelo di Lodovico Buonarroti Simoni","Michael Cera","Michael B. Jordan","Michael Douglas","Michael Cox","Michael Myers","Michael Moore","Michael Caine","Michael Crichton","Michael Owen","Michael Bublé","Michael Corleone","Michael Paul Chan","Mike Pompeo","Michael Bay","Michael Keaton","Mike Tyson","Michael Bloomberg","Michael Bolton","Michael Pence","Michael Palin"];


    //make FQL json to find our shortener term
    var body = JSON.stringify(
        {"paginate":{"match":{"index":"totals"},"terms":[]},"size":100000}
    );

    var https = require("https");

    const options = {
        hostname: "db.fauna.com",
        path: "/",
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.FAUNA_API, 'Content-Length': Buffer.byteLength(body) },
    }

    var req = https.request(options, function (res) {
        res.setEncoding("utf8");

        var body = "";

        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("close", function() {
            var bodyJson = JSON.parse(body);

            var result = {};
            for(var i = 0; i < schemeKeys.length; i++) {
                if(!result[schemeKeys[i]]) result[schemeKeys[i]] = 0;

                for(var j = 0; j < bodyJson.resource.data.length; j++) {
                    result[schemeKeys[i]] += bodyJson.resource.data[j][i];
                }
            }
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(result),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });
    });

    req.on("error", function(err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: err.message,
            headers: {"Content-Type": "text/plain"}
        });
    });

    req.end(body);
}