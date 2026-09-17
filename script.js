/* =====================================================
   NIHS ZOMBIE APOCALYPSE
   MAIN GAME SCRIPT
===================================================== */


/* =====================================================
   GAME DATA
===================================================== */

const characters = {

    7: {
        boys: [
            "Steve",
            "Cyber",
            "C"
        ],

        girls: [
            "A",
            "J",
            "T"
        ]
    },

    8: {
        boys: [
            "BOSS H",
            "BOSS NY",
            "E",
            "D"
        ],

        girls: [
            "XYHH",
            "ASH",
            "JORLONG",
            "MITCH",
            "HYRIS"
        ]
    },

    9: {
        boys: [
            "R",
            "D",
            "EJ"
        ],

        girls: [
            "Y",
            "H",
            "V"
        ]
    },

    10: {
        boys: [
            "JOHN REYNARD",
            "ARCHEL",
            "CARL",
            "RHEY",
            "RHAMCES",
            "CRISTIAN",
            "JES",
            "SHR",
            "JUL",
            "ARCH",
            "KENT",
            "RENCEY",
            "ELM",
            "REX",
            "JC"
        ],

        girls: [
            "A",
            "S",
            "J",
            "M",
            "I",
            "D"
        ]
    },

    11: {
        boys: [
            "A",
            "C",
            "R"
        ],

        girls: [
            "D",
            "M",
            "J"
        ]
    },

    12: {
        boys: [
            "S",
            "AR",
            "T"
        ],

        girls: []
    }
};


/* =====================================================
   WEAPONS
===================================================== */

const weapons = [

    {
        name: "CHALK",
        damage: 5,
        price: 0
    },

    {
        name: "BOOK",
        damage: 5,
        price: 0
    },

    {
        name: "STONE",
        damage: 10,
        price: 100
    },

    {
        name: "BALLPEN",
        damage: 10,
        price: 150
    },

    {
        name: "CHAIR",
        damage: 15,
        price: 300
    },

    {
        name: "LAPTOP",
        damage: 20,
        price: 500
    },

    {
        name: "BROOM",
        damage: 10,
        price: 250
    },

    {
        name: "WATER BOTTLE",
        damage: 10,
        price: 200
    },

    {
        name: "RULER",
        damage: 5,
        price: 100
    },

    {
        name: "BAG",
        damage: 15,
        price: 350
    },

    {
        name: "TRASH BIN",
        damage: 20,
        price: 600
    },

    {
        name: "FIRE EXTINGUISHER",
        damage: 20,
        price: 1000
    }

];


/* =====================================================
   ROOMS
===================================================== */

const rooms = {

    1: {
        name: "ROOM 1",
        type: "classroom",
        enemyCount: 3,
        enemyHealth: 50
    },

    2: {
        name: "ROOM 2",
        type: "classroom2",
        enemyCount: 5,
        enemyHealth: 60
    },

    3: {
        name: "ROOM 3",
        type: "hallway",
        enemyCount: 7,
        enemyHealth: 70
    },

    4: {
        name: "ROOM 4",
        type: "science",
        enemyCount: 9,
        enemyHealth: 80
    },

    5: {
        name: "ROOM 5",
        type: "library",
        enemyCount: 12,
        enemyHealth: 90
    },

    6: {
        name: "ROOM 6",
        type: "final",
        enemyCount: 15,
        enemyHealth: 100
    }

};


/* =====================================================
   GAME STATE
===================================================== */

let state = {

    grade: 7,

    character: null,

    side: null,

    health: 100,

    maxHealth: 100,

    room: 1,

    level: 1,

    weapon: weapons[0],

    coins: 0,

    purchasedWeapons: ["CHALK", "BOOK"],

    settings: {

        master: 1,

        music: .6,

        sfx: .8,

        vibration: true,

        fullscreen: false

    }

};


/* =====================================================
   SCREEN SYSTEM
===================================================== */

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.add("hidden");

        });

    document
        .getElementById(id)
        .classList.remove("hidden");

}


/* =====================================================
   AUDIO
===================================================== */

const gameMusic =
    document.getElementById("gameMusic");

const yawaSound =
    document.getElementById("yawaSound");

const clickSound =
    document.getElementById("clickSound");


function playClick() {

    if (!clickSound) return;

    clickSound.volume =
        state.settings.master *
        state.settings.sfx;

    clickSound.currentTime = 0;

    clickSound.play().catch(() => {});
}


function updateAudio() {

    gameMusic.volume =
        state.settings.master *
        state.settings.music;

}


function startMusic() {

    updateAudio();

    gameMusic
        .play()
        .catch(() => {});
}


function stopMusic() {

    gameMusic.pause();

}


/* =====================================================
   INTRO
===================================================== */

let introIndex = 0;

const introImages = [

    "assets/intro/intro1.png",

    "assets/intro/intro2.png",

    "assets/intro/intro3.png"

];


function startIntro() {

    const image =
        document.getElementById("introImage");

    introIndex = 0;

    showIntroImage();

}


function showIntroImage() {

    const image =
        document.getElementById("introImage");

    image.classList.remove("show");

    setTimeout(() => {

        image.style.backgroundImage =
            `url("${introImages[introIndex]}")`;

        image.classList.add("show");

    }, 100);


    setTimeout(() => {

        if (introIndex < introImages.length - 1) {

            introIndex++;

            showIntroImage();

        } else {

            setTimeout(() => {

                showMenu();

            }, 2000);

        }

    }, 2000);

}


document
    .getElementById("introSkip")
    .addEventListener(
        "click",
        () => {

            playClick();

            showMenu();

        }
    );


function showMenu() {

    document
        .getElementById("introScreen")
        .classList.add("hidden");

    showScreen("menuScreen");

}


/* =====================================================
   NEW GAME
===================================================== */

function newGame() {

    playClick();

    state.character = null;
    state.side = null;

    state.health = 100;

    state.room = 1;
    state.level = 1;

    selectGrade(7);

    showScreen("characterScreen");

}


/* =====================================================
   CONTINUE
===================================================== */

function continueGame() {

    playClick();

    const saved =
        localStorage.getItem(
            "NIHS_ZOMBIE_SAVE"
        );

    if (!saved) {

        alert("Wala pay save nga duwa.");

        return;

    }

    try {

        state =
            JSON.parse(saved);

        updateCharacterList();

        showScreen("sideScreen");

    } catch {

        alert("Dili mabasa ang imong save.");

    }

}


/* =====================================================
   CHARACTER SELECTION
===================================================== */

function selectGrade(grade) {

    state.grade = grade;

    updateCharacterList();

}


function updateCharacterList() {

    const list =
        document.getElementById(
            "characterList"
        );

    list.innerHTML = "";

    const grade =
        characters[state.grade];

    if (!grade) return;


    function addCharacters(
        names,
        gender
    ) {

        names.forEach(name => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "characterCard";


            let specialClass = "";

            if (
                name ===
                "JOHN REYNARD"
            ) {

                specialClass =
                    "john";

            }

            if (
                name ===
                "XYHH"
            ) {

                specialClass =
                    "xyhh";

            }


            const icon =
                gender === "boy"
                    ? "👦"
                    : "👧";


            card.innerHTML = `

                <div class="
                    characterVisual
                    ${gender === "girl" ? "girl" : ""}
                    ${specialClass}
                ">
                    ${icon}
                </div>

                <h3>${name}</h3>

                <small>
                    ${gender === "boy"
                        ? "LALAKI"
                        : "BABAYE"}
                </small>
            `;


            card.onclick = () => {

                selectCharacter(
                    name,
                    gender
                );

            };


            list.appendChild(card);

        });

    }


    addCharacters(
        grade.boys,
        "boy"
    );

    addCharacters(
        grade.girls,
        "girl"
    );

}


function selectCharacter(
    name,
    gender
) {

    playClick();

    state.character = {

        name,

        gender,

        grade: state.grade

    };


    document
        .querySelectorAll(
            ".characterCard"
        )
        .forEach(card => {

            card.classList.remove(
                "selected"
            );

        });


    const preview =
        document.getElementById(
            "previewCharacter"
        );

    preview.innerText =
        gender === "boy"
            ? "👦"
            : "👧";


    preview.className = "";


    if (name === "JOHN REYNARD") {

        preview.classList.add("john");

    }


    if (name === "XYHH") {

        preview.classList.add("xyhh");

    }


    document.getElementById(
        "previewName"
    ).innerText = name;


    let info =
        `Baitang ${state.grade} • ` +
        (gender === "boy"
            ? "Lalaki"
            : "Babaye");


    if (
        name === "JOHN REYNARD"
    ) {

        info +=
            " • Espesyal nga asul nga outfit.";

    }


    if (
        name === "XYHH"
    ) {

        info +=
            " • Espesyal nga purpura nga outfit.";

    }


    document.getElementById(
        "previewInfo"
    ).innerText = info;

}


function confirmCharacter() {

    if (!state.character) {

        alert(
            "Pili usa og karakter."
        );

        return;

    }

    playClick();

    showScreen("sideScreen");

}


/* =====================================================
   SIDE
===================================================== */

function chooseSide(side) {

    playClick();

    state.side = side;

    if (side === "human") {

        state.maxHealth = 100;

        state.health = 100;

    } else {

        state.maxHealth = 200;

        state.health = 200;

    }

    saveGame();

    startGame();

}


/* =====================================================
   GAME START
===================================================== */

let ctx;

const canvas =
    document.getElementById(
        "gameCanvas"
    );

function startGame() {

    showScreen("gameScreen");

    startMusic();

    setupCanvas();

    updateHUD();

    createRoom();

    startGameLoop();

    startYawaTimer();

}


function setupCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    ctx =
        canvas.getContext("2d");

}


window.addEventListener(
    "resize",
    setupCanvas
);


/* =====================================================
   ROOM SYSTEM
===================================================== */

let player = {

    x: 0,

    y: 0,

    radius: 20,

    speed: 3

};


let enemies = [];

let roomObjects = [];


function createRoom() {

    const room =
        rooms[state.room];

    enemies = [];

    roomObjects = [];


    player.x =
        canvas.width / 2;

    player.y =
        canvas.height / 2;


    /* Walls */

    roomObjects.push({

        type: "wall",

        x: 0,

        y: 0,

        w: canvas.width,

        h: 25

    });


    roomObjects.push({

        type: "wall",

        x: 0,

        y: canvas.height - 25,

        w: canvas.width,

        h: 25

    });


    roomObjects.push({

        type: "wall",

        x: 0,

        y: 0,

        w: 25,

        h: canvas.height

    });


    roomObjects.push({

        type: "wall",

        x: canvas.width - 25,

        y: 0,

        w: 25,

        h: canvas.height

    });


    /* Furniture / obstacles */

    const count =
        state.room + 2;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        roomObjects.push({

            type: "furniture",

            x:
                70 +
                Math.random() *
                (canvas.width - 180),

            y:
                100 +
                Math.random() *
                (canvas.height - 220),

            w:
                70 +
                Math.random() * 50,

            h:
                35 +
                Math.random() * 30

        });

    }


    /* Enemies */

    for (
        let i = 0;
        i < room.enemyCount;
        i++
    ) {

        let enemy = {

            x:
                50 +
                Math.random() *
                (canvas.width - 100),

            y:
                80 +
                Math.random() *
                (canvas.height - 140),

            radius: 18,

            health:
                room.enemyHealth,

            maxHealth:
                room.enemyHealth,

            speed:
                .5 +
                state.room * .08,

            infected: false

        };

        enemies.push(enemy);

    }


    updateHUD();

}


/* =====================================================
   DRAW ROOM
===================================================== */

function drawRoom() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* FLOOR */

    ctx.fillStyle =
        state.room % 2 === 0
            ? "#242424"
            : "#303030";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* FLOOR TILES */

    ctx.strokeStyle =
        "rgba(255,255,255,.05)";

    ctx.lineWidth = 1;


    for (
        let x = 25;
        x < canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 25);

        ctx.lineTo(
            x,
            canvas.height - 25
        );

        ctx.stroke();

    }


    for (
        let y = 25;
        y < canvas.height;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(25, y);

        ctx.lineTo(
            canvas.width - 25,
            y
        );

        ctx.stroke();

    }


    /* ROOM OBJECTS */

    roomObjects.forEach(obj => {

        if (obj.type === "wall") {

            ctx.fillStyle =
                "#101010";

            ctx.fillRect(
                obj.x,
                obj.y,
                obj.w,
                obj.h
            );

        }


        if (
            obj.type ===
            "furniture"
        ) {

            ctx.fillStyle =
                "#654321";

            ctx.fillRect(
                obj.x,
                obj.y,
                obj.w,
                obj.h
            );

            ctx.strokeStyle =
                "#8b6a45";

            ctx.strokeRect(
                obj.x,
                obj.y,
                obj.w,
                obj.h
            );

        }

    });


    /* PLAYER */

    ctx.save();

    ctx.shadowBlur = 15;

    ctx.shadowColor =
        state.side === "human"
            ? "white"
            : "purple";

    ctx.fillStyle =
        state.side === "human"
            ? "#4da6ff"
            : "#8b36ff";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();


    /* ENEMIES */

    enemies.forEach(enemy => {

        ctx.fillStyle =
            enemy.infected
                ? "#9b4dff"
                : "#4cdb55";

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* HEALTH */

        const healthWidth = 40;

        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            enemy.x - 20,
            enemy.y - 30,
            healthWidth,
            5
        );

        ctx.fillStyle =
            "#ff3333";

        ctx.fillRect(
            enemy.x - 20,
            enemy.y - 30,
            healthWidth *
            (
                enemy.health /
                enemy.maxHealth
            ),
            5
        );

    });

}


/* =====================================================
   GAME LOOP
===================================================== */

let gameRunning = false;

function startGameLoop() {

    if (gameRunning) return;

    gameRunning = true;

    gameLoop();

}


function gameLoop() {

    if (!gameRunning) return;

    updateGame();

    drawRoom();

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   UPDATE GAME
===================================================== */

function updateGame() {

    if (paused) return;


    /* Enemy AI */

    enemies.forEach(enemy => {

        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > 35) {

            enemy.x +=
                dx / distance *
                enemy.speed;

            enemy.y +=
                dy / distance *
                enemy.speed;

        }


        if (
            distance < 38
        ) {

            if (
                state.side ===
                "human"
            ) {

                state.health -= .05;

            } else {

                /* Zombie attacks students */

                enemy.health -= .02;

                if (
                    !enemy.infected &&
                    enemy.health <
                    enemy.maxHealth * .5
                ) {

                    enemy.infected =
                        true;

                }

            }

            updateHUD();

        }

    });


    /* Remove dead enemies */

    enemies =
        enemies.filter(
            enemy =>
                enemy.health > 0
        );


    /* Room complete */

    if (
        enemies.length === 0
    ) {

        nextRoom();

    }


    /* Player death */

    if (
        state.health <= 0
    ) {

        loseGame();

    }

}


/* =====================================================
   ATTACK
===================================================== */

function attack() {

    if (paused) return;

    playClick();


    if (
        state.side ===
        "zombie"
    ) {

        /* ZOMBIE = BITE ONLY */

        enemies.forEach(enemy => {

            const dx =
                enemy.x -
                player.x;

            const dy =
                enemy.y -
                player.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance < 100
            ) {

                enemy.health -= 25;

                enemy.infected =
                    true;

            }

        });

        return;

    }


    /* HUMAN WEAPON */

    enemies.forEach(enemy => {

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            distance < 150
        ) {

            enemy.health -=
                state.weapon.damage;

        }

    });

}


/* =====================================================
   NEXT ROOM
===================================================== */

function nextRoom() {

    if (state.room >= 6) {

        winGame();

        return;

    }


    state.room++;

    state.level =
        state.room;


    saveGame();


    if (
        state.room === 4
    ) {

        showCheckpoint();

    }


    setTimeout(() => {

        createRoom();

    }, 500);

}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    document.getElementById(
        "healthFill"
    ).style.width =
        Math.max(
            0,
            state.health /
            state.maxHealth *
            100
        ) + "%";


    document.getElementById(
        "healthText"
    ).innerText =
        Math.ceil(
            state.health
        ) +
        " / " +
        state.maxHealth;


    document.getElementById(
        "roomNumber"
    ).innerText =
        state.room;


    document.getElementById(
        "levelNumber"
    ).innerText =
        state.level;


    document.getElementById(
        "playerName"
    ).innerText =
        state.character
            ? state.character.name
            : "PLAYER";


    document.getElementById(
        "weaponName"
    ).innerText =
        state.side === "zombie"
            ? "KAGAT"
            : state.weapon.name;


    document.getElementById(
        "weaponDamage"
    ).innerText =
        state.side === "zombie"
            ? "DAMAGE 25"
            : "DAMAGE " +
              state.weapon.damage;

}


/* =====================================================
   PAUSE
===================================================== */

let paused = false;


function pauseGame() {

    paused = true;

    document
        .getElementById(
            "pauseScreen"
        )
        .classList.remove(
            "hidden"
        );

}


function resumeGame() {

    document
        .getElementById(
            "pauseScreen"
        )
        .classList.add(
            "hidden"
        );


    let count = 3;

    const old =
        document.querySelector(
            ".pauseBox h1"
        );


    old.innerText =
        count;


    const timer =
        setInterval(() => {

            count--;

            old.innerText =
                count;

            if (
                count <= 0
            ) {

                clearInterval(timer);

                old.innerText =
                    "PADAYON!";

                paused = false;

            }

        }, 1000);

}


/* =====================================================
   SETTINGS
===================================================== */

function openSettings(
    fromGame = false
) {

    playClick();

    state.settings.fromGame =
        fromGame;

    document
        .getElementById(
            "masterVolume"
        ).value =
        state.settings.master;

    document
        .getElementById(
            "musicVolume"
        ).value =
        state.settings.music;

    document
        .getElementById(
            "sfxVolume"
        ).value =
        state.settings.sfx;

    document
        .getElementById(
            "vibrationToggle"
        ).checked =
        state.settings.vibration;

    document
        .getElementById(
            "fullscreenToggle"
        ).checked =
        state.settings.fullscreen;


    showScreen(
        "settingsScreen"
    );

}


function closeSettings() {

    if (
        state.settings.fromGame
    ) {

        showScreen("gameScreen");

        delete state.settings.fromGame;

        return;

    }

    showMenu();

}


function saveSettings() {

    state.settings.master =
        Number(
            document.getElementById(
                "masterVolume"
            ).value
        );

    state.settings.music =
        Number(
            document.getElementById(
                "musicVolume"
            ).value
        );

    state.settings.sfx =
        Number(
            document.getElementById(
                "sfxVolume"
            ).value
        );

    state.settings.vibration =
        document.getElementById(
            "vibrationToggle"
        ).checked;

    state.settings.fullscreen =
        document.getElementById(
            "fullscreenToggle"
        ).checked;


    updateAudio();

    saveGame();

    alert(
        "Na-save na ang setting."
    );

}


/* =====================================================
   SHOP
===================================================== */

function openShop() {

    playClick();

    renderShop();

    showScreen(
        "shopScreen"
    );

}


function renderShop() {

    document.getElementById(
        "coinsText"
    ).innerText =
        state.coins;


    const container =
        document.getElementById(
            "shopItems"
        );

    container.innerHTML = "";


    weapons.forEach(weapon => {

        const owned =
            state.purchasedWeapons
                .includes(
                    weapon.name
                );


        const div =
            document.createElement(
                "div"
            );

        div.className =
            "shopItem";


        div.innerHTML = `

            <h3>${weapon.name}</h3>

            <p>
                DAMAGE:
                ${weapon.damage}
            </p>

            <p>
                PRESYO:
                ${weapon.price}
            </p>

            <button>
                ${
                    owned
                        ? "EQUIP"
                        : "PALIT"
                }
            </button>
        `;


        div
            .querySelector("button")
            .onclick = () => {

                if (owned) {

                    state.weapon =
                        weapon;

                    saveGame();

                    alert(
                        weapon.name +
                        " ang imong gigamit."
                    );

                    return;

                }


                if (
                    state.coins >=
                    weapon.price
                ) {

                    state.coins -=
                        weapon.price;

                    state.purchasedWeapons
                        .push(
                            weapon.name
                        );

                    saveGame();

                    renderShop();

                } else {

                    alert(
                        "Kulang imong kwarta."
                    );

                }

            };


        container.appendChild(
            div
        );

    });

}


/* =====================================================
   CINEMATICS
===================================================== */

let cinematicTimeout;


function showCheckpoint() {

    showCinematic(
        "assets/videos/checkpoint.mp4",
        10000
    );

}


function winGame() {

    gameRunning = false;

    stopMusic();

    saveGame();

    showCinematic(
        "assets/videos/victory.mp4",
        30000,
        () => {

            showMenu();

        }
    );

}


function loseGame() {

    gameRunning = false;

    stopMusic();

    showCinematic(
        "assets/videos/defeat.mp4",
        30000,
        () => {

            showMenu();

        }
    );

}


function showCinematic(
    src,
    duration,
    callback
) {

    const overlay =
        document.getElementById(
            "cinematicScreen"
        );

    const video =
        document.getElementById(
            "cinematicVideo"
        );


    overlay.classList.remove(
        "hidden"
    );


    video.src = src;

    video.currentTime = 0;

    video.play().catch(() => {});


    clearTimeout(
        cinematicTimeout
    );


    cinematicTimeout =
        setTimeout(
            () => {

                closeCinematic(
                    callback
                );

            },
            duration
        );


    document.getElementById(
        "cinematicSkip"
    ).onclick = () => {

        closeCinematic(
            callback
        );

    };

}


function closeCinematic(
    callback
) {

    clearTimeout(
        cinematicTimeout
    );


    const video =
        document.getElementById(
            "cinematicVideo"
        );


    video.pause();

    video.removeAttribute(
        "src"
    );

    video.load();


    document
        .getElementById(
            "cinematicScreen"
        )
        .classList.add(
            "hidden"
        );


    if (callback) {

        callback();

    } else {

        startMusic();

    }

}


/* =====================================================
   YAWA
===================================================== */

let yawaTimer = null;


function startYawaTimer() {

    clearInterval(
        yawaTimer
    );


    yawaTimer =
        setInterval(() => {

            if (
                !gameRunning ||
                paused
            ) {

                return;

            }


            if (
                !document
                    .getElementById(
                        "gameScreen"
                    )
                    .classList
                    .contains(
                        "hidden"
                    )
            ) {

                yawaSound.volume =
                    state.settings.master *
                    state.settings.sfx;

                yawaSound.currentTime = 0;

                yawaSound
                    .play()
                    .catch(() => {});

            }

        }, 3000);

}


/* =====================================================
   SAVE
===================================================== */

function saveGame() {

    try {

        localStorage.setItem(

            "NIHS_ZOMBIE_SAVE",

            JSON.stringify(
                state
            )

        );

    } catch (error) {

        console.log(
            "Save error:",
            error
        );

    }

}


/* =====================================================
   BACK / QUIT
===================================================== */

function backToMenu() {

    playClick();

    showMenu();

}


function quitGame() {

    paused = false;

    gameRunning = false;

    stopMusic();

    document
        .getElementById(
            "pauseScreen"
        )
        .classList.add(
            "hidden"
        );

    showMenu();

}


/* =====================================================
   MOBILE JOYSTICKS
===================================================== */

function setupJoystick(
    joystickId,
    movementCallback
) {

    const joystick =
        document.getElementById(
            joystickId
        );

    const knob =
        joystick.querySelector(
            ".joystickKnob"
        );


    let active = false;


    function move(event) {

        if (!active) return;


        const rect =
            joystick
                .getBoundingClientRect();


        const touch =
            event.touches
                ? event.touches[0]
                : event;


        let x =
            touch.clientX -
            (
                rect.left +
                rect.width / 2
            );

        let y =
            touch.clientY -
            (
                rect.top +
                rect.height / 2
            );


        const max =
            rect.width / 2 -
            25;


        const distance =
            Math.sqrt(
                x*x +
                y*y
            );


        if (
            distance > max
        ) {

            x =
                x / distance *
                max;

            y =
                y / distance *
                max;

        }


        knob.style.transform =
            `translate(
                calc(-50% + ${x}px),
                calc(-50% + ${y}px)
            )`;


        movementCallback(
            x / max,
            y / max
        );

    }


    function end() {

        active = false;

        knob.style.transform =
            "translate(-50%,-50%)";

        movementCallback(
            0,
            0
        );

    }


    joystick.addEventListener(
        "touchstart",
        e => {

            active = true;

            e.preventDefault();

        },
        { passive:false }
    );


    joystick.addEventListener(
        "touchmove",
        e => {

            move(e);

            e.preventDefault();

        },
        { passive:false }
    );


    joystick.addEventListener(
        "touchend",
        end
    );

}


/* LEFT JOYSTICK = MOVEMENT */

setupJoystick(
    "leftJoystick",
    (x,y) => {

        if (paused) return;

        player.x +=
            x *
            player.speed;

        player.y +=
            y *
            player.speed;


        player.x =
            Math.max(
                30,
                Math.min(
                    canvas.width - 30,
                    player.x
                )
            );


        player.y =
            Math.max(
                30,
                Math.min(
                    canvas.height - 30,
                    player.y
                )
            );

    }
);


/* RIGHT JOYSTICK = AIM */

setupJoystick(
    "rightJoystick",
    (x,y) => {

        /*

           Ang direction gikan
           sa right joystick
           gamiton nato sa attack
           system sa sunod nga
           expansion.

        */

    }
);


/* =====================================================
   ATTACK BUTTON
===================================================== */

document
    .getElementById(
        "attackButton"
    )
    .addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            attack();

        }
    );


/* =====================================================
   START
===================================================== */

window.addEventListener(
    "load",
    () => {

        loadSettings();

        startIntro();

    }
);


/* =====================================================
   LOAD SETTINGS
===================================================== */

function loadSettings() {

    const saved =
        localStorage.getItem(
            "NIHS_ZOMBIE_SAVE"
        );


    if (!saved) return;


    try {

        const data =
            JSON.parse(saved);


        if (
            data.settings
        ) {

            state.settings =
                {
                    ...state.settings,
                    ...data.settings
                };

        }


        if (
            data.coins !== undefined
        ) {

            state.coins =
                data.coins;

        }


    } catch {

        console.log(
            "Wala pay valid settings."
        );

    }

}
