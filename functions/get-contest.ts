import { generate_new_competition } from "../competition";
import { NetlifyEvent, NetlifyCallback, NetlifyContext, setKey } from "./.types";


//@ts-ignore
exports.handler = function (event: NetlifyEvent, context: NetlifyContext, callback: NetlifyCallback) {
    let nth = +(event.queryStringParameters.iter as string);
    if (isNaN(nth)) nth = 0;

    const contest = generate_new_competition(nth);

    setKey(`competitions:${event.queryStringParameters.self || "anon"}:${contest.id}:competitors`, `${contest.a.id},${contest.b.id}`)
        .then(() => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(contest),
                headers: { "Content-Type": "application/json" }
            });
        })
        .catch(() => {
            callback(null, {
                statusCode: 500,
                body: "",
                headers: { "Content-Type": "application/json" }
            });
        });
};
