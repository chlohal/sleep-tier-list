import { generate_new_competition } from "../competition";
import { NetlifyEvent, NetlifyCallback, NetlifyContext } from "./.types";


//@ts-ignore
exports.handler = function (event: NetlifyEvent, context: NetlifyContext, callback: NetlifyCallback) {
    let nth = +(event.queryStringParameters.iter as string);
    if(isNaN(nth)) nth = 0;

    const contest = generate_new_competition(nth);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(contest),
        headers: {
            "Content-Type": "application/json",
        },
    });
};
