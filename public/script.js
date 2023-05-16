window.addEventListener("load", onload);

const QUEUE_SIZE = 10;

let NUM_CONTESTS = 0;

const contestQueue = [];
let aButton, bButton, shadow, main;

function onload() {
    shadow = document.getElementById("shadow");
    main = document.querySelector("main");

    aButton = document.getElementById("a-button");
    bButton = document.getElementById("b-button");

    window.addEventListener("keypress", (e) => {
        if(e.key == "1") aButton.click();
        else if(e.key == "2") bButton.click();
    });

    document.getElementById("go").addEventListener("click", () => {
        document.getElementById("intro").remove();
    });

    for(let i = 0; i < QUEUE_SIZE; i++) addToQueue();

    startContest();
}

function takeFromQueue(cb) {
    if(contestQueue.length < QUEUE_SIZE) addToQueue();

    if(contestQueue.length > 0) cb(contestQueue.shift());
    else addToQueue((c) => {
        activateQueuedContest(c);
        cb(c);
    });
}

function activateQueuedContest(queuedContest) {
}

function addToQueue(cb) {
    loadContest((contest) => {
        let contestAButton = document.createElement("div");
        let contestBButton = document.createElement("div");

        contestAButton.textContent = contest.a.text
        contestBButton.textContent = contest.b.text;

        shadow.appendChild(contestAButton);
        shadow.appendChild(contestBButton);

        if(cb) cb({
            aButtonImage: contestAButton,
            bButtonImage: contestBButton,
            contest: contest,
        });
    });
}

function startContest() {
    
    takeFromQueue((queuedContest) => {        
        aButton.appendChild(queuedContest.aButtonImage);
        bButton.appendChild(queuedContest.bButtonImage);

        let contest = queuedContest.contest;

        function newContest() {
            aButton.removeEventListener("click", aListen);
            bButton.removeEventListener("click", bListen);

            aButton.removeChild(queuedContest.aButtonImage);
            bButton.removeChild(queuedContest.bButtonImage);
            
            startContest();
        }

        function aListen() {
            awardPoint(contest.id, contest.a.id);
            newContest();
            
        }
        function bListen() {
            awardPoint(contest.id, contest.b.id);
            newContest();
        }

        aButton.addEventListener("click", aListen);
        bButton.addEventListener("click", bListen);
    });
}

function loadContest(cb) {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "/api/get-contest?iter=" + (NUM_CONTESTS++));

    xhr.onload = function() {
        cb(JSON.parse(xhr.responseText));
    }

    xhr.send()
}

function awardPoint(contestId, personName) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/mark-winner`);

    xhr.send(JSON.stringify({
        id: contestId,
        winner: personName
    }));
}