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

    if (!("id" in bodyJson)) {
        callback(null, {
            statusCode: 400,
            body: "Invalid Contest ID",
            headers: { "Content-Type": "text/plain" }
        });
        return false;
    }

    const winner = `${bodyJson.winner}`;

    const sendBody = "+1";

    var https = require("https");

    const options = {
        hostname: "kvdb.io",
        path: `/2wpYMHjg4XyNt4QQhF8yW8/${encodeURIComponent(winner)}`,
        method: 'PATCH',
        headers: { 'Content-Length': Buffer.byteLength(sendBody) },
    }

    var req = https.request(options, function (res) {
        callback(null, {
            statusCode: 201,
            body: "",
            headers: { "Content-Type": "application/json" }
        });
    });

    req.on("error", function (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: "",
            headers: { "Content-Type": "text/plain" }
        });
    });

    req.end(sendBody);
}