export type Response = {
    statusCode: number,
    headers?: { [x: string]: string },
    multiValueHeaders: { [x: string]: string },
    body: string,
    isBase64Encoded: string
};

export type NetlifyCallback = (error: any, response: Partial<Response>) => void;

export type NetlifyContext = {
    callbackWaitsForEmptyEventLoop: boolean
    functionName: string
    functionVersion: string
    invokedFunctionArn: string
    memoryLimitInMB: string
    awsRequestId: string
    logGroupName: string
    logStreamName: string
    identity?: { [key: string]: any }
    clientContext?: { [key: string]: any }
    getRemainingTimeInMillis: () => number
}

export type NetlifyEvent = {
    rawUrl: string
    rawQuery: string
    path: string
    httpMethod: string
    headers: { [name: string]: string | undefined }
    multiValueHeaders: { [name: string]: string[] | undefined }
    queryStringParameters: { [name: string]: string | undefined }
    multiValueQueryStringParameters: { [name: string]: string[] | undefined }
    body: string | null
    isBase64Encoded: boolean
}


export function setKey(key: string, value: string): Promise<void> {
    //@ts-ignore
    var https = require("https");

    return new Promise((resolve, reject) => {
        const options = {
            hostname: "kvdb.io",
            path: `/5ECkmP5qaKfsoTsesTETpZ/${encodeURIComponent(key)}`,
            method: 'POST', //@ts-ignore
            headers: { 'Content-Length': Buffer.byteLength(value) },
        }

        var req = https.request(options, function (res) {
            resolve();
        });

        req.on("error", function (err) {
            reject(err);
        });

        req.end(value);



    });
}