//@ts-nocheck

import { NetlifyEvent, NetlifyCallback, NetlifyContext } from "./.types";

//@ts-ignore
exports.handler = function (event: NetlifyEvent, context: NetlifyContext, callback: NetlifyCallback) {
    var body = event.body;

    var bodyJson: { winner: number, id: string };

    try {
        bodyJson = JSON.parse(body as string);
    } catch (e) {
        callback(null, {
            statusCode: 400,
            body: "Body is not JSON",
            headers: { "Content-Type": "text/plain" }
        });
        return false;
    }

    if (typeof bodyJson.id !== "string") {
        callback(null, {
            statusCode: 400,
            body: "Invalid Contest ID",
            headers: { "Content-Type": "text/plain" }
        });
        return false;
    }

    const contest_issue_time = parseInt(bodyJson.id.slice(0, -NUM_RANDOM_ID_CHARS), 36);
    const time_since_issue = Date.now() - contest_issue_time;
    if(time_since_issue > 300_000 || time_since_issue < 0) {
        callback(null, {
            statusCode: 400,
            body: "Expired Contest ID",
            headers: { "Content-Type": "text/plain" }
        });
        return false;
    }

    const winner = `${bodyJson.winner}`;

    const sendBody = "+1";

    var https = require("https");

    const options = {
        hostname: "kvdb.io",
        path: `/5ECkmP5qaKfsoTsesTETpZ/${encodeURIComponent(winner)}`,
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