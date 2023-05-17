import { NUM_RANDOM_ID_CHARS } from "../competition";
import { NetlifyEvent, NetlifyCallback, NetlifyContext, setKey } from "./.types";

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
    if (time_since_issue > 300_000 || time_since_issue < 0) {
        callback(null, {
            statusCode: 400,
            body: "Expired Contest ID",
            headers: { "Content-Type": "text/plain" }
        });
        return false;
    }

    setKey(`competitions:${bodyJson.id}:winner`, `${bodyJson.winner}`)
        .then(() => {
            callback(null, {
                statusCode: 201,
                body: "",
                headers: { "Content-Type": "application/json" }
            });
        })
        .catch((err) => {
            console.error(err);
            callback(null, {
                statusCode: 500,
                body: "",
                headers: { "Content-Type": "application/json" }
            });
        });
}