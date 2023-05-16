window.addEventListener("load", onload);

const QUEUE_SIZE = 10;

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
        let contestAButton = document.createElement("img");
        let contestBButton = document.createElement("img");

        contestAButton.src = contest.contestantOne.image;
        contestBButton.src = contest.contestantTwo.image;

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
            increaseHotness(contest.id, contest.contestantOne.name);
            newContest();
            
        }
        function bListen() {
            increaseHotness(contest.id, contest.contestantTwo.name);
            newContest();
        }

        aButton.addEventListener("click", aListen);
        bButton.addEventListener("click", bListen);
    });
}

function loadContest(cb) {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "/api/get-contest");

    xhr.onload = function() {
        cb(JSON.parse(xhr.responseText));
    }

    xhr.send()
}

function increaseHotness(contestId, personName) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/mark-winner`);

    xhr.send(JSON.stringify({
        id: contestId,
        winner: personName
    }));
}