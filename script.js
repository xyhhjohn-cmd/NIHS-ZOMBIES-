/* =========================================================
   NIHS ZOMBIE APOCALYPSE
   UPDATED SCRIPT.JS
   Character Image System + Existing Game Systems
   ========================================================= */


/* =========================================================
   GAME DATA
   ========================================================= */

const characters = {
  7: {
    boys: ["Steve", "Cyber", "C"],
    girls: ["A", "J", "T"]
  },

  8: {
    boys: ["BOSS H", "BOSS NY", "E", "D"],
    girls: ["XYHH", "ASH", "JORLONG", "MITCH", "HYRIS"]
  },

  9: {
    boys: ["R", "D", "EJ"],
    girls: ["Y", "H", "V"]
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

    girls: ["A", "S", "J", "M", "I", "D"]
  },

  11: {
    boys: ["A", "C", "R"],
    girls: ["D", "M", "J"]
  },

  12: {
    boys: ["S", "AR", "T"],
    girls: []
  }
};


/* =========================================================
   WEAPONS
   ========================================================= */

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


/* =========================================================
   ROOMS
   ========================================================= */

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


/* =========================================================
   GAME STATE
   ========================================================= */

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

  purchasedWeapons: [
    "CHALK",
    "BOOK"
  ],

  settings: {

    master: 1,

    music: 0.6,

    sfx: 0.8,

    vibration: true,

    fullscreen: false

  }

};


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let gameRunning = false;

let paused = false;

let gameLoopId = null;

let enemies = [];

let objects = [];

let yawaTimer = null;

let countdownRunning = false;

let currentJoystick = null;

let joystickData = {

  left: {
    active: false,
    x: 0,
    y: 0
  },

  right: {
    active: false,
    x: 0,
    y: 0
  }

};


/* =========================================================
   PLAYER
   ========================================================= */

const player = {

  x: 400,

  y: 300,

  radius: 20,

  speed: 3,

  aimX: 1,

  aimY: 0

};


/* =========================================================
   DOM
   ========================================================= */

const canvas = document.getElementById("gameCanvas");

const ctx = canvas
  ? canvas.getContext("2d")
  : null;

const gameMusic =
  document.getElementById("gameMusic");

const yawaSound =
  document.getElementById("yawaSound");

const clickSound =
  document.getElementById("clickSound");


/* =========================================================
   SCREEN SYSTEM
   ========================================================= */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove("active");

    });

  const target =
    document.getElementById(id);

  if (target) {

    target.classList.add("active");

  }

}


/* =========================================================
   CLICK SOUND
   ========================================================= */

function playClick() {

  if (!clickSound) return;

  try {

    clickSound.currentTime = 0;

    clickSound.volume =
      state.settings.master *
      state.settings.sfx;

    clickSound.play().catch(() => {});

  } catch (error) {}

}


/* =========================================================
   AUDIO
   ========================================================= */

function updateAudio() {

  if (!gameMusic) return;

  gameMusic.volume =
    state.settings.master *
    state.settings.music;

}


function startMusic() {

  if (!gameMusic) return;

  updateAudio();

  gameMusic.loop = true;

  gameMusic.play().catch(() => {});

}


function stopMusic() {

  if (!gameMusic) return;

  gameMusic.pause();

  gameMusic.currentTime = 0;

}


/* =========================================================
   CHARACTER IMAGE SYSTEM
   ========================================================= */

function getCharacterImage(name) {

  if (!name) {

    return "assets/characters/character-default.svg";

  }


  const upperName =
    String(name).toUpperCase();


  /*
     SPECIAL CHARACTER:
     JOHN REYNARD
  */

  if (upperName === "JOHN REYNARD") {

    return "assets/characters/john-reynard.svg";

  }


  /*
     SPECIAL CHARACTER:
     XYHH
  */

  if (upperName === "XYHH") {

    return "assets/characters/xyhh.svg";

  }


  /*
     ALL OTHER CHARACTERS
  */

  return "assets/characters/character-default.svg";

}


/* =========================================================
   CHARACTER IMAGE ELEMENT
   ========================================================= */

function createCharacterImage(name, gender, className = "") {

  const img =
    document.createElement("img");

  img.className =
    `character-image ${className}`;

  img.src =
    getCharacterImage(name);

  img.alt =
    name || "Character";

  img.draggable = false;

  img.loading = "lazy";


  /*
     FALLBACK
     Kung hindi makita ang SVG,
     default character ang lalabas.
  */

  img.onerror = function () {

    if (
      img.src.includes(
        "character-default.svg"
      )
    ) {

      return;

    }

    img.src =
      "assets/characters/character-default.svg";

  };


  /*
     Basic inline styling para
     gumana kahit wala pang CSS update.
  */

  img.style.width = "100%";

  img.style.height = "100%";

  img.style.objectFit = "contain";

  img.style.pointerEvents = "none";

  img.style.userSelect = "none";


  return img;

}


/* =========================================================
   INTRO
   ========================================================= */

const introImages = [

  "assets/intro/intro1.png",

  "assets/intro/intro2.png",

  "assets/intro/intro3.png"

];

let introIndex = 0;

let introTimer = null;


function startIntro() {

  showScreen("introScreen");

  introIndex = 0;

  showIntroImage();

}


function showIntroImage() {

  const intro =
    document.getElementById(
      "introScreen"
    );

  if (!intro) {

    showMenu();

    return;

  }


  intro.style.backgroundImage =
    `url("${introImages[introIndex]}")`;


  intro.classList.remove(
    "intro-image-active"
  );


  void intro.offsetWidth;


  intro.classList.add(
    "intro-image-active"
  );


  /*
     Third image gets animation.
  */

  if (introIndex === 2) {

    intro.classList.add(
      "intro-third-image"
    );

  } else {

    intro.classList.remove(
      "intro-third-image"
    );

  }


  clearTimeout(introTimer);


  introTimer = setTimeout(() => {

    introIndex++;

    if (
      introIndex >=
      introImages.length
    ) {

      /*
         Keep third image visible.
         Do not immediately remove it.
      */

      return;

    }


    showIntroImage();

  }, 2000);

}


/* =========================================================
   INTRO SKIP
   ========================================================= */

const introSkip =
  document.getElementById(
    "introSkip"
  );


if (introSkip) {

  introSkip.addEventListener(
    "click",
    () => {

      playClick();

      clearTimeout(introTimer);

      showMenu();

    }
  );

}


/* =========================================================
   MAIN MENU
   ========================================================= */

function showMenu() {

  clearTimeout(introTimer);

  showScreen("menuScreen");

  startMusic();

}


/* =========================================================
   NEW GAME
   ========================================================= */

function newGame() {

  playClick();


  state.character = null;

  state.side = null;

  state.health = 100;

  state.maxHealth = 100;

  state.room = 1;

  state.level = 1;

  state.weapon = weapons[0];

  state.purchasedWeapons = [
    "CHALK",
    "BOOK"
  ];


  selectGrade(7);

  showScreen(
    "characterScreen"
  );

}


/* =========================================================
   CONTINUE GAME
   ========================================================= */

function continueGame() {

  playClick();

  const saved =
    localStorage.getItem(
      "NIHS_ZOMBIE_SAVE"
    );


  if (!saved) {

    alert(
      "Wala pay na-save nga duwa."
    );

    return;

  }


  try {

    const loaded =
      JSON.parse(saved);


    state = {

      ...state,

      ...loaded,

      settings: {

        ...state.settings,

        ...(loaded.settings || {})

      }

    };


    updateCharacterList();

    showScreen("sideScreen");

  } catch (error) {

    alert(
      "Dili mabasa ang save file."
    );

  }

}


/* =========================================================
   CHARACTER GRADE SELECTION
   ========================================================= */

function selectGrade(grade) {

  playClick();

  state.grade = Number(grade);

  updateCharacterList();


  /*
     Update grade buttons
  */

  document
    .querySelectorAll(
      ".grade-button"
    )
    .forEach(button => {

      button.classList.remove(
        "selected"
      );

      if (
        Number(
          button.dataset.grade
        ) === state.grade
      ) {

        button.classList.add(
          "selected"
        );

      }

    });

}


/* =========================================================
   CHARACTER LIST
   ========================================================= */

function updateCharacterList() {

  const container =
    document.getElementById(
      "characterList"
    );


  if (!container) return;


  container.innerHTML = "";


  const gradeData =
    characters[state.grade];


  if (!gradeData) return;


  /*
     BOYS
  */

  gradeData.boys.forEach(name => {

    createCharacterCard(
      container,
      name,
      "Lalaki"
    );

  });


  /*
     GIRLS
  */

  gradeData.girls.forEach(name => {

    createCharacterCard(
      container,
      name,
      "Babaye"
    );

  });

}


/* =========================================================
   CHARACTER CARD
   ========================================================= */

function createCharacterCard(
  container,
  name,
  gender
) {

  const card =
    document.createElement("div");


  card.className =
    "characterCard";


  /*
     Special classes
  */

  if (
    name.toUpperCase() ===
    "JOHN REYNARD"
  ) {

    card.classList.add("john");

  }


  if (
    name.toUpperCase() ===
    "XYHH"
  ) {

    card.classList.add("xyhh");

  }


  /*
     IMAGE AREA
  */

  const imageBox =
    document.createElement("div");

  imageBox.className =
    "character-card-image";


  const image =
    createCharacterImage(
      name,
      gender
    );


  imageBox.appendChild(image);

  card.appendChild(imageBox);


  /*
     NAME
  */

  const nameElement =
    document.createElement("div");

  nameElement.className =
    "character-name";

  nameElement.textContent =
    name;

  card.appendChild(
    nameElement
  );


  /*
     GENDER
  */

  const genderElement =
    document.createElement("div");

  genderElement.className =
    "character-gender";

  genderElement.textContent =
    gender;

  card.appendChild(
    genderElement
  );


  /*
     Special description
  */

  if (
    name.toUpperCase() ===
    "JOHN REYNARD"
  ) {

    const special =
      document.createElement("div");

    special.className =
      "character-special";

    special.textContent =
      "Asul nga espesyal nga outfit";

    card.appendChild(
      special
    );

  }


  if (
    name.toUpperCase() ===
    "XYHH"
  ) {

    const special =
      document.createElement("div");

    special.className =
      "character-special";

    special.textContent =
      "Purpura nga espesyal nga outfit";

    card.appendChild(
      special
    );

  }


  /*
     Selected state
  */

  if (
    state.character &&
    state.character.name === name &&
    Number(
      state.character.grade
    ) === Number(state.grade)
  ) {

    card.classList.add(
      "selected"
    );

  }


  /*
     Click
  */

  card.addEventListener(
    "click",
    () => {

      playClick();

      selectCharacter(
        name,
        gender
      );

    }
  );


  container.appendChild(card);

}


/* =========================================================
   SELECT CHARACTER
   ========================================================= */

function selectCharacter(
  name,
  gender
) {

  state.character = {

    name: name,

    gender: gender,

    grade: state.grade

  };


  /*
     Remove previous selection
  */

  document
    .querySelectorAll(
      ".characterCard"
    )
    .forEach(card => {

      card.classList.remove(
        "selected"
      );

    });


  /*
     Find selected card by name
  */

  document
    .querySelectorAll(
      ".characterCard"
    )
    .forEach(card => {

      const nameElement =
        card.querySelector(
          ".character-name"
        );


      if (
        nameElement &&
        nameElement.textContent ===
        name
      ) {

        card.classList.add(
          "selected"
        );

      }

    });


  /*
     BIG PREVIEW
  */

  const preview =
    document.getElementById(
      "previewCharacter"
    );


  if (preview) {

    preview.innerHTML = "";


    const previewImage =
      createCharacterImage(
        name,
        gender,
        "preview-character-image"
      );


    preview.appendChild(
      previewImage
    );


    preview.classList.remove(
      "john",
      "xyhh"
    );


    if (
      name.toUpperCase() ===
      "JOHN REYNARD"
    ) {

      preview.classList.add(
        "john"
      );

    }


    if (
      name.toUpperCase() ===
      "XYHH"
    ) {

      preview.classList.add(
        "xyhh"
      );

    }

  }


  /*
     Preview name
  */

  const previewName =
    document.getElementById(
      "previewName"
    );


  if (previewName) {

    previewName.textContent =
      name;

  }


  /*
     Preview information
  */

  const previewInfo =
    document.getElementById(
      "previewInfo"
    );


  if (previewInfo) {

    let info =
      `Baitang ${state.grade} • ${gender}`;


    if (
      name.toUpperCase() ===
      "JOHN REYNARD"
    ) {

      info +=
        " • Asul nga espesyal nga outfit";

    }


    if (
      name.toUpperCase() ===
      "XYHH"
    ) {

      info +=
        " • Purpura nga espesyal nga outfit";

    }


    previewInfo.textContent =
      info;

  }


  /*
     Save character selection
  */

  saveGame();

}


/* =========================================================
   CONFIRM CHARACTER
   ========================================================= */

function confirmCharacter() {

  playClick();


  if (!state.character) {

    alert(
      "Pili usa og karakter."
    );

    return;

  }


  showScreen("sideScreen");

}


/* =========================================================
   SIDE SELECTION
   ========================================================= */

function chooseSide(side) {

  playClick();

  state.side = side;


  if (side === "human") {

    state.maxHealth = 100;

    state.health = 100;

  }


  if (side === "zombie") {

    state.maxHealth = 200;

    state.health = 200;

  }


  saveGame();

  startGame();

}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

  showScreen("gameScreen");

  startMusic();

  setupCanvas();

  updateHUD();

  createRoom();

  gameRunning = true;

  paused = false;

  startGameLoop();

  startYawaTimer();

}


/* =========================================================
   CANVAS
   ========================================================= */

function setupCanvas() {

  if (!canvas) return;


  function resizeCanvas() {

    const rect =
      canvas.getBoundingClientRect();


    canvas.width =
      Math.max(
        400,
        Math.floor(rect.width)
      );


    canvas.height =
      Math.max(
        300,
        Math.floor(rect.height)
      );


    player.x =
      Math.min(
        player.x,
        canvas.width - 40
      );


    player.y =
      Math.min(
        player.y,
        canvas.height - 40
      );

  }


  resizeCanvas();


  if (!canvas.dataset.resizeBound) {

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    canvas.dataset.resizeBound =
      "true";

  }

}


/* =========================================================
   CREATE ROOM
   ========================================================= */

function createRoom() {

  if (!canvas) return;


  const room =
    rooms[state.room];


  enemies = [];

  objects = [];


  /*
     Player spawn
  */

  player.x =
    canvas.width / 2;

  player.y =
    canvas.height / 2;


  /*
     Furniture / objects
  */

  const objectCount =
    8 + state.room;


  for (
    let i = 0;
    i < objectCount;
    i++
  ) {

    objects.push({

      x:
        60 +
        Math.random() *
        Math.max(
          100,
          canvas.width - 120
        ),

      y:
        60 +
        Math.random() *
        Math.max(
          100,
          canvas.height - 120
        ),

      width:
        40 +
        Math.random() * 60,

      height:
        25 +
        Math.random() * 45

    });

  }


  /*
     Enemies
  */

  for (
    let i = 0;
    i < room.enemyCount;
    i++
  ) {

    let x =
      50 +
      Math.random() *
      Math.max(
        100,
        canvas.width - 100
      );

    let y =
      50 +
      Math.random() *
      Math.max(
        100,
        canvas.height - 100
      );


    /*
       Ayaw i-spawn sa player.
    */

    if (
      Math.abs(
        x - player.x
      ) < 100
    ) {

      x += 120;

    }


    if (
      Math.abs(
        y - player.y
      ) < 100
    ) {

      y += 120;

    }


    enemies.push({

      x: x,

      y: y,

      radius: 18,

      health:
        room.enemyHealth,

      maxHealth:
        room.enemyHealth,

      speed:
        0.5 +
        state.room * 0.08,

      infected: false,

      dead: false

    });

  }

}


/* =========================================================
   DRAW ROOM
   ========================================================= */

function drawRoom() {

  if (!ctx || !canvas) return;


  const width =
    canvas.width;

  const height =
    canvas.height;


  /*
     FLOOR
  */

  ctx.fillStyle =
    "#202020";

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  /*
     FLOOR TILES
  */

  ctx.strokeStyle =
    "rgba(255,255,255,0.04)";

  ctx.lineWidth = 1;


  const tileSize = 40;


  for (
    let x = 0;
    x < width;
    x += tileSize
  ) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(
      x,
      height
    );

    ctx.stroke();

  }


  for (
    let y = 0;
    y < height;
    y += tileSize
  ) {

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(
      width,
      y
    );

    ctx.stroke();

  }


  /*
     WALLS
  */

  ctx.fillStyle =
    "#111";

  ctx.fillRect(
    0,
    0,
    width,
    20
  );

  ctx.fillRect(
    0,
    height - 20,
    width,
    20
  );

  ctx.fillRect(
    0,
    0,
    20,
    height
  );

  ctx.fillRect(
    width - 20,
    0,
    20,
    height
  );


  /*
     FURNITURE
  */

  objects.forEach(obj => {

    ctx.fillStyle =
      "#5b4636";

    ctx.fillRect(
      obj.x,
      obj.y,
      obj.width,
      obj.height
    );


    ctx.strokeStyle =
      "#2b211a";

    ctx.strokeRect(
      obj.x,
      obj.y,
      obj.width,
      obj.height
    );

  });


  /*
     ENEMIES
  */

  enemies.forEach(enemy => {

    if (enemy.dead) return;


    ctx.save();


    /*
       Zombie body
    */

    ctx.beginPath();

    ctx.arc(
      enemy.x,
      enemy.y,
      enemy.radius,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      state.side === "zombie"
        ? "#8d45a8"
        : "#4b9b59";


    ctx.fill();


    ctx.restore();


    /*
       Health bar
    */

    const barWidth = 36;

    const healthPercent =
      Math.max(
        0,
        enemy.health /
        enemy.maxHealth
      );


    ctx.fillStyle =
      "#111";

    ctx.fillRect(
      enemy.x -
        barWidth / 2,
      enemy.y - 28,
      barWidth,
      5
    );


    ctx.fillStyle =
      "#e33";

    ctx.fillRect(
      enemy.x -
        barWidth / 2,
      enemy.y - 28,
      barWidth *
        healthPercent,
      5
    );

  });


  /*
     PLAYER
  */

  ctx.save();


  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    player.radius,
    0,
    Math.PI * 2
  );


  ctx.fillStyle =
    state.side === "zombie"
      ? "#9c4ed8"
      : "#eeeeee";


  ctx.fill();


  ctx.shadowBlur = 15;

  ctx.shadowColor =
    state.side === "zombie"
      ? "#a84dff"
      : "#ffffff";


  ctx.restore();


  /*
     AIM DIRECTION
  */

  const aimLength = 35;


  ctx.beginPath();

  ctx.moveTo(
    player.x,
    player.y
  );

  ctx.lineTo(
    player.x +
      player.aimX *
      aimLength,

    player.y +
      player.aimY *
      aimLength
  );


  ctx.strokeStyle =
    "#ffffff";

  ctx.lineWidth = 3;

  ctx.stroke();

}


/* =========================================================
   GAME LOOP
   ========================================================= */

function startGameLoop() {

  if (gameLoopId) {

    cancelAnimationFrame(
      gameLoopId
    );

  }


  gameRunning = true;

  gameLoop();

}


function gameLoop() {

  if (!gameRunning) {

    return;

  }


  if (!paused) {

    updateGame();

    drawRoom();

  }


  gameLoopId =
    requestAnimationFrame(
      gameLoop
    );

}


/* =========================================================
   UPDATE GAME
   ========================================================= */

function updateGame() {

  if (!canvas) return;


  /*
     LEFT JOYSTICK MOVEMENT
  */

  if (
    joystickData.left.active
  ) {

    player.x +=
      joystickData.left.x *
      player.speed;

    player.y +=
      joystickData.left.y *
      player.speed;

  }


  /*
     RIGHT JOYSTICK AIM
  */

  if (
    joystickData.right.active
  ) {

    const ax =
      joystickData.right.x;

    const ay =
      joystickData.right.y;


    const length =
      Math.sqrt(
        ax * ax +
        ay * ay
      );


    if (length > 0.15) {

      player.aimX =
        ax / length;

      player.aimY =
        ay / length;

    }

  }


  /*
     PLAYER BOUNDS
  */

  player.x =
    Math.max(
      35,
      Math.min(
        canvas.width - 35,
        player.x
      )
    );


  player.y =
    Math.max(
      35,
      Math.min(
        canvas.height - 35,
        player.y
      )
    );


  /*
     ENEMY AI
  */

  enemies.forEach(enemy => {

    if (enemy.dead) return;


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


    if (distance > 1) {

      enemy.x +=
        (dx / distance) *
        enemy.speed;

      enemy.y +=
        (dy / distance) *
        enemy.speed;

    }


    /*
       ATTACK / BITE
    */

    if (distance < 45) {

      if (
        state.side === "human"
      ) {

        state.health -=
          0.05;

      } else {

        enemy.health -=
          0.02;

        enemy.infected = true;

      }

    }

  });


  /*
     REMOVE DEAD ENEMIES
  */

  enemies =
    enemies.filter(enemy => {

      if (
        enemy.health <= 0
      ) {

        enemy.dead = true;

        return false;

      }

      return true;

    });


  /*
     ROOM COMPLETE
  */

  if (
    enemies.length === 0
  ) {

    nextRoom();

    return;

  }


  /*
     PLAYER DEATH
  */

  if (
    state.health <= 0
  ) {

    state.health = 0;

    loseGame();

  }


  updateHUD();

}


/* =========================================================
   ATTACK
   ========================================================= */

function attack() {

  if (
    !gameRunning ||
    paused
  ) {

    return;

  }


  playClick();


  /*
     ZOMBIE ATTACK
     Only bite.
  */

  if (
    state.side === "zombie"
  ) {

    let closest = null;

    let closestDistance =
      Infinity;


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
        distance < 100 &&
        distance <
          closestDistance
      ) {

        closest =
          enemy;

        closestDistance =
          distance;

      }

    });


    if (closest) {

      closest.health -= 25;

      closest.infected = true;

    }


    return;

  }


  /*
     HUMAN WEAPON ATTACK
  */

  const damage =
    state.weapon
      ? state.weapon.damage
      : 5;


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


    if (distance < 150) {

      /*
         Check direction
      */

      const directionX =
        dx / Math.max(
          distance,
          1
        );

      const directionY =
        dy / Math.max(
          distance,
          1
        );


      const dot =
        directionX *
          player.aimX +
        directionY *
          player.aimY;


      /*
         Attack forward.
         But allow close enemies.
      */

      if (
        distance < 65 ||
        dot > 0.25
      ) {

        enemy.health -=
          damage;

      }

    }

  });


  updateHUD();

}


/* =========================================================
   NEXT ROOM
   ========================================================= */

function nextRoom() {

  if (
    state.room >= 6
  ) {

    winGame();

    return;

  }


  state.room++;

  state.level =
    state.room;


  saveGame();


  /*
     ROOM 4 CHECKPOINT
  */

  if (
    state.room === 4
  ) {

    showCheckpoint();

  }


  setTimeout(() => {

    if (!gameRunning) return;

    createRoom();

    updateHUD();

  }, 500);

}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

  const healthBar =
    document.getElementById(
      "healthBar"
    );


  const healthText =
    document.getElementById(
      "healthText"
    );


  const roomText =
    document.getElementById(
      "roomText"
    );


  const levelText =
    document.getElementById(
      "levelText"
    );


  const playerName =
    document.getElementById(
      "playerName"
    );


  const weaponName =
    document.getElementById(
      "weaponName"
    );


  if (healthBar) {

    const percent =
      Math.max(
        0,
        Math.min(
          100,
          (state.health /
            state.maxHealth) *
            100
        )
      );

    healthBar.style.width =
      `${percent}%`;

  }


  if (healthText) {

    healthText.textContent =
      `${Math.ceil(
        state.health
      )}/${state.maxHealth}`;

  }


  if (roomText) {

    roomText.textContent =
      rooms[state.room]
        ? rooms[state.room].name
        : `ROOM ${state.room}`;

  }


  if (levelText) {

    levelText.textContent =
      `LEVEL ${state.level}`;

  }


  if (playerName) {

    playerName.textContent =
      state.character
        ? state.character.name
        : "PLAYER";

  }


  if (weaponName) {

    weaponName.textContent =
      state.weapon
        ? `${state.weapon.name} • ${state.weapon.damage} DAMAGE`
        : "WALAY ARMAS";

  }

}


/* =========================================================
   PAUSE
   ========================================================= */

function pauseGame() {

  if (
    !gameRunning ||
    paused
  ) {

    return;

  }


  playClick();

  paused = true;

  showScreen("pauseScreen");

}


/* =========================================================
   RESUME
   ========================================================= */

function resumeGame() {

  if (
    countdownRunning
  ) {

    return;

  }


  playClick();


  countdownRunning =
    true;


  showScreen("gameScreen");


  const countdown =
    document.getElementById(
      "countdownText"
    );


  if (!countdown) {

    paused = false;

    countdownRunning =
      false;

    return;

  }


  let number = 3;


  countdown.textContent =
    number;


  const timer =
    setInterval(() => {

      number--;


      if (
        number > 0
      ) {

        countdown.textContent =
          number;

      } else {

        clearInterval(timer);

        countdown.textContent =
          "PADAYON!";


        setTimeout(() => {

          countdown.textContent =
            "";

          paused = false;

          countdownRunning =
            false;

        }, 700);

      }

    }, 1000);

}


/* =========================================================
   SETTINGS
   ========================================================= */

let settingsFromGame =
  false;


function openSettings(
  fromGame = false
) {

  playClick();

  settingsFromGame =
    fromGame;


  const master =
    document.getElementById(
      "masterVolume"
    );

  const music =
    document.getElementById(
      "musicVolume"
    );

  const sfx =
    document.getElementById(
      "sfxVolume"
    );

  const vibration =
    document.getElementById(
      "vibrationToggle"
    );


  if (master) {

    master.value =
      state.settings.master;

  }


  if (music) {

    music.value =
      state.settings.music;

  }


  if (sfx) {

    sfx.value =
      state.settings.sfx;

  }


  if (vibration) {

    vibration.checked =
      state.settings.vibration;

  }


  updateAudio();

  showScreen(
    "settingsScreen"
  );

}


/* =========================================================
   CLOSE SETTINGS
   ========================================================= */

function closeSettings() {

  playClick();


  if (
    settingsFromGame
  ) {

    showScreen(
      "gameScreen"
    );

  } else {

    showMenu();

  }

}


/* =========================================================
   SAVE SETTINGS
   ========================================================= */

function saveSettings() {

  playClick();


  const master =
    document.getElementById(
      "masterVolume"
    );

  const music =
    document.getElementById(
      "musicVolume"
    );

  const sfx =
    document.getElementById(
      "sfxVolume"
    );

  const vibration =
    document.getElementById(
      "vibrationToggle"
    );


  if (master) {

    state.settings.master =
      Number(master.value);

  }


  if (music) {

    state.settings.music =
      Number(music.value);

  }


  if (sfx) {

    state.settings.sfx =
      Number(sfx.value);

  }


  if (vibration) {

    state.settings.vibration =
      vibration.checked;

  }


  updateAudio();

  saveGame();


  alert(
    "Na-save na ang settings."
  );

}


/* =========================================================
   SHOP
   ========================================================= */

function openShop() {

  playClick();

  renderShop();

  showScreen(
    "shopScreen"
  );

}


/* =========================================================
   RENDER SHOP
   ========================================================= */

function renderShop() {

  const container =
    document.getElementById(
      "shopList"
    );


  const coins =
    document.getElementById(
      "shopCoins"
    );


  if (!container) return;


  container.innerHTML = "";


  if (coins) {

    coins.textContent =
      state.coins;

  }


  weapons.forEach(weapon => {

    const item =
      document.createElement("div");

    item.className =
      "shop-item";


    const owned =
      state.purchasedWeapons
        .includes(
          weapon.name
        );


    const equipped =
      state.weapon &&
      state.weapon.name ===
      weapon.name;


    item.innerHTML = `

      <div class="shop-name">
        ${weapon.name}
      </div>

      <div class="shop-info">
        DAMAGE: ${weapon.damage}
      </div>

      <div class="shop-info">
        PRESYO: ${weapon.price}
      </div>

    `;


    const button =
      document.createElement(
        "button"
      );


    if (equipped) {

      button.textContent =
        "NA-EQUIP NA";

      button.disabled =
        true;

    } else if (owned) {

      button.textContent =
        "EQUIP";

      button.addEventListener(
        "click",
        () => {

          playClick();

          state.weapon =
            weapon;

          saveGame();

          renderShop();

          updateHUD();

        }
      );

    } else {

      button.textContent =
        "PALIT";


      button.addEventListener(
        "click",
        () => {

          playClick();


          if (
            state.coins <
            weapon.price
          ) {

            alert(
              "Kulang ang coins."
            );

            return;

          }


          state.coins -=
            weapon.price;


          state.purchasedWeapons
            .push(
              weapon.name
            );


          state.weapon =
            weapon;


          saveGame();

          renderShop();

          updateHUD();


          alert(
            `${weapon.name} na-paliton ug na-equip.`
          );

        }
      );

    }


    item.appendChild(
      button
    );


    container.appendChild(
      item
    );

  });

}


/* =========================================================
   CINEMATICS
   ========================================================= */

let cinematicTimer =
  null;

let cinematicCallback =
  null;


function showCheckpoint() {

  showCinematic(
    "assets/videos/checkpoint.mp4",
    10000,
    null
  );

}


function winGame() {

  gameRunning = false;

  paused = false;


  if (gameLoopId) {

    cancelAnimationFrame(
      gameLoopId
    );

    gameLoopId = null;

  }


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

  paused = false;


  if (gameLoopId) {

    cancelAnimationFrame(
      gameLoopId
    );

    gameLoopId = null;

  }


  stopMusic();


  showCinematic(
    "assets/videos/defeat.mp4",
    30000,
    () => {

      showMenu();

    }
  );

}


/* =========================================================
   SHOW CINEMATIC
   ========================================================= */

function showCinematic(
  videoSrc,
  duration,
  callback
) {

  const screen =
    document.getElementById(
      "cinematicScreen"
    );


  const video =
    document.getElementById(
      "cinematicVideo"
    );


  const skip =
    document.getElementById(
      "cinematicSkip"
    );


  if (!screen || !video) {

    if (callback) callback();

    return;

  }


  cinematicCallback =
    callback;


  clearTimeout(
    cinematicTimer
  );


  video.src =
    videoSrc;


  video.currentTime =
    0;


  video.muted = false;


  showScreen(
    "cinematicScreen"
  );


  try {

    video.play().catch(
      () => {}
    );

  } catch (error) {}


  cinematicTimer =
    setTimeout(() => {

      closeCinematic();

    }, duration);


  if (skip) {

    skip.onclick =
      () => {

        playClick();

        closeCinematic();

      };

  }

}


/* =========================================================
   CLOSE CINEMATIC
   ========================================================= */

function closeCinematic() {

  clearTimeout(
    cinematicTimer
  );


  const video =
    document.getElementById(
      "cinematicVideo"
    );


  if (video) {

    video.pause();

    video.removeAttribute(
      "src"
    );

    video.load();

  }


  const callback =
    cinematicCallback;


  cinematicCallback =
    null;


  if (callback) {

    callback();

  } else {

    /*
       Checkpoint:
       balik sa game.
    */

    showScreen(
      "gameScreen"
    );

    startMusic();

  }

}


/* =========================================================
   YAWA SOUND
   ========================================================= */

function startYawaTimer() {

  stopYawaTimer();


  yawaTimer =
    setInterval(() => {

      /*
         YAWA ONLY DURING GAMEPLAY
      */

      const gameScreen =
        document.getElementById(
          "gameScreen"
        );


      const playing =
        gameScreen &&
        gameScreen.classList
          .contains("active");


      if (
        gameRunning &&
        !paused &&
        playing
      ) {

        playYawa();

      }

    }, 3000);

}


function stopYawaTimer() {

  if (yawaTimer) {

    clearInterval(
      yawaTimer
    );

    yawaTimer = null;

  }

}


function playYawa() {

  if (!yawaSound) return;


  try {

    yawaSound.currentTime =
      0;

    yawaSound.volume =
      state.settings.master *
      state.settings.sfx;

    yawaSound.play().catch(
      () => {}
    );

  } catch (error) {}

}


/* =========================================================
   SAVE GAME
   ========================================================= */

function saveGame() {

  try {

    localStorage.setItem(
      "NIHS_ZOMBIE_SAVE",
      JSON.stringify(state)
    );

  } catch (error) {

    console.warn(
      "Dili ma-save ang game.",
      error
    );

  }

}


/* =========================================================
   LOAD SETTINGS / SAVE
   ========================================================= */

function loadSettings() {

  const saved =
    localStorage.getItem(
      "NIHS_ZOMBIE_SAVE"
    );


  if (!saved) {

    updateAudio();

    return;

  }


  try {

    const loaded =
      JSON.parse(saved);


    state = {

      ...state,

      ...loaded,

      settings: {

        ...state.settings,

        ...(loaded.settings || {})

      }

    };


    /*
       Restore weapon
    */

    if (
      loaded.weapon &&
      loaded.weapon.name
    ) {

      const foundWeapon =
        weapons.find(
          weapon =>
            weapon.name ===
            loaded.weapon.name
        );


      if (foundWeapon) {

        state.weapon =
          foundWeapon;

      }

    }


    /*
       Safety defaults
    */

    if (
      !Array.isArray(
        state.purchasedWeapons
      )
    ) {

      state.purchasedWeapons = [
        "CHALK",
        "BOOK"
      ];

    }


    updateAudio();

  } catch (error) {

    console.warn(
      "Dili ma-load ang save.",
      error
    );

  }

}


/* =========================================================
   BACK TO MENU
   ========================================================= */

function backToMenu() {

  playClick();

  showMenu();

}


/* =========================================================
   QUIT GAME
   ========================================================= */

function quitGame() {

  playClick();


  paused = false;

  gameRunning = false;


  if (gameLoopId) {

    cancelAnimationFrame(
      gameLoopId
    );

    gameLoopId = null;

  }


  stopYawaTimer();

  stopMusic();

  showMenu();

}


/* =========================================================
   JOYSTICK SYSTEM
   ========================================================= */

function setupJoystick(
  element,
  type
) {

  if (!element) return;


  let activePointer =
    null;


  function updateJoystick(
    event
  ) {

    const rect =
      element.getBoundingClientRect();


    const centerX =
      rect.left +
      rect.width / 2;


    const centerY =
      rect.top +
      rect.height / 2;


    let dx =
      event.clientX -
      centerX;


    let dy =
      event.clientY -
      centerY;


    const maxDistance =
      rect.width / 2;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (
      distance >
      maxDistance
    ) {

      dx =
        dx / distance *
        maxDistance;

      dy =
        dy / distance *
        maxDistance;

    }


    const normalizedX =
      dx /
      maxDistance;


    const normalizedY =
      dy /
      maxDistance;


    joystickData[type] = {

      active: true,

      x: normalizedX,

      y: normalizedY

    };


    const stick =
      element.querySelector(
        ".joystick-stick"
      );


    if (stick) {

      stick.style.transform =
        `translate(${dx}px, ${dy}px)`;

    }

  }


  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      activePointer =
        event.pointerId;


      element.setPointerCapture(
        event.pointerId
      );


      updateJoystick(event);

    }
  );


  element.addEventListener(
    "pointermove",
    event => {

      if (
        activePointer !==
        event.pointerId
      ) {

        return;

      }


      event.preventDefault();

      updateJoystick(event);

    }
  );


  function resetJoystick() {

    activePointer = null;


    joystickData[type] = {

      active: false,

      x: 0,

      y: 0

    };


    const stick =
      element.querySelector(
        ".joystick-stick"
      );


    if (stick) {

      stick.style.transform =
        "translate(0, 0)";

    }

  }


  element.addEventListener(
    "pointerup",
    resetJoystick
  );


  element.addEventListener(
    "pointercancel",
    resetJoystick
  );


  element.addEventListener(
    "lostpointercapture",
    resetJoystick
  );

}


/* =========================================================
   INITIALIZE JOYSTICKS
   ========================================================= */

function initializeJoysticks() {

  const left =
    document.getElementById(
      "leftJoystick"
    );


  const right =
    document.getElementById(
      "rightJoystick"
    );


  setupJoystick(
    left,
    "left"
  );


  setupJoystick(
    right,
    "right"
  );

}


/* =========================================================
   ATTACK BUTTON
   ========================================================= */

function initializeAttackButton() {

  const attackButton =
    document.getElementById(
      "attackButton"
    );


  if (!attackButton) return;


  attackButton.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      attack();

    }
  );

}


/* =========================================================
   MENU BUTTON CONNECTIONS
   ========================================================= */

function connectButtons() {

  const startButton =
    document.getElementById(
      "start-button"
    );


  if (startButton) {

    startButton.addEventListener(
      "click",
      () => {

        playClick();

        newGame();

      }
    );

  }


  const continueButton =
    document.getElementById(
      "continueButton"
    );


  if (continueButton) {

    continueButton.addEventListener(
      "click",
      continueGame
    );

  }


  const settingsButton =
    document.getElementById(
      "settingsButton"
    );


  if (settingsButton) {

    settingsButton.addEventListener(
      "click",
      () => {

        openSettings(false);

      }
    );

  }


  const shopButton =
    document.getElementById(
      "shopButton"
    );


  if (shopButton) {

    shopButton.addEventListener(
      "click",
      openShop
    );

  }


  const confirmButton =
    document.getElementById(
      "confirmCharacter"
    );


  if (confirmButton) {

    confirmButton.addEventListener(
      "click",
      confirmCharacter
    );

  }


  const humanButton =
    document.getElementById(
      "humanButton"
    );


  if (humanButton) {

    humanButton.addEventListener(
      "click",
      () => {

        chooseSide("human");

      }
    );

  }


  const zombieButton =
    document.getElementById(
      "zombieButton"
    );


  if (zombieButton) {

    zombieButton.addEventListener(
      "click",
      () => {

        chooseSide("zombie");

      }
    );

  }


  const pauseButton =
    document.getElementById(
      "pauseButton"
    );


  if (pauseButton) {

    pauseButton.addEventListener(
      "click",
      pauseGame
    );

  }


  const resumeButton =
    document.getElementById(
      "resumeButton"
    );


  if (resumeButton) {

    resumeButton.addEventListener(
      "click",
      resumeGame
    );

  }


  const pauseSettings =
    document.getElementById(
      "pauseSettingsButton"
    );


  if (pauseSettings) {

    pauseSettings.addEventListener(
      "click",
      () => {

        openSettings(true);

      }
    );

  }


  const quitButton =
    document.getElementById(
      "quitButton"
    );


  if (quitButton) {

    quitButton.addEventListener(
      "click",
      quitGame
    );

  }


  const saveSettingsButton =
    document.getElementById(
      "saveSettingsButton"
    );


  if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
      "click",
      saveSettings
    );

  }


  const settingsBack =
    document.getElementById(
      "settingsBack"
    );


  if (settingsBack) {

    settingsBack.addEventListener(
      "click",
      closeSettings
    );

  }


  const shopBack =
    document.getElementById(
      "shopBack"
    );


  if (shopBack) {

    shopBack.addEventListener(
      "click",
      backToMenu
    );

  }


  const characterBack =
    document.getElementById(
      "characterBack"
    );


  if (characterBack) {

    characterBack.addEventListener(
      "click",
      backToMenu
    );

  }


  const sideBack =
    document.getElementById(
      "sideBack"
    );


  if (sideBack) {

    sideBack.addEventListener(
      "click",
      () => {

        showScreen(
          "characterScreen"
        );

      }
    );

  }

}


/* =========================================================
   GRADE BUTTON CONNECTIONS
   ========================================================= */

function connectGradeButtons() {

  document
    .querySelectorAll(
      ".grade-button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const grade =
            Number(
              button.dataset.grade
            );


          selectGrade(
            grade
          );

        }
      );

    });

}


/* =========================================================
   AUDIO SLIDER LIVE UPDATE
   ========================================================= */

function connectAudioSliders() {

  const master =
    document.getElementById(
      "masterVolume"
    );

  const music =
    document.getElementById(
      "musicVolume"
    );

  const sfx =
    document.getElementById(
      "sfxVolume"
    );


  if (master) {

    master.addEventListener(
      "input",
      () => {

        state.settings.master =
          Number(master.value);

        updateAudio();

      }
    );

  }


  if (music) {

    music.addEventListener(
      "input",
      () => {

        state.settings.music =
          Number(music.value);

        updateAudio();

      }
    );

  }


  if (sfx) {

    sfx.addEventListener(
      "input",
      () => {

        state.settings.sfx =
          Number(sfx.value);

      }
    );

  }

}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

const keys = {};


window.addEventListener(
  "keydown",
  event => {

    keys[event.key.toLowerCase()] =
      true;


    /*
       Attack
    */

    if (
      event.key ===
      " "
    ) {

      event.preventDefault();

      attack();

    }


    /*
       Pause
    */

    if (
      event.key ===
      "Escape"
    ) {

      if (
        gameRunning &&
        !paused
      ) {

        pauseGame();

      }

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    keys[event.key.toLowerCase()] =
      false;

  }
);


/* =========================================================
   KEYBOARD MOVEMENT
   ========================================================= */

function updateKeyboardMovement() {

  if (
    !gameRunning ||
    paused
  ) {

    return;

  }


  let x = 0;

  let y = 0;


  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    y -= 1;

  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    y += 1;

  }


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    x -= 1;

  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    x += 1;

  }


  const length =
    Math.sqrt(
      x * x +
      y * y
    );


  if (length > 0) {

    player.x +=
      (x / length) *
      player.speed;

    player.y +=
      (y / length) *
      player.speed;

  }

}


/* =========================================================
   PATCH UPDATE GAME FOR KEYBOARD
   ========================================================= */

const originalUpdateGame =
  updateGame;


/*
   Instead of replacing the complete
   game system, keyboard movement is
   called through this timer.
*/

setInterval(() => {

  updateKeyboardMovement();

}, 16);


/* =========================================================
   FULLSCREEN
   ========================================================= */

function toggleFullscreen() {

  try {

    if (
      !document.fullscreenElement
    ) {

      document
        .documentElement
        .requestFullscreen()
        .catch(
          () => {}
        );

      state.settings.fullscreen =
        true;

    } else {

      document
        .exitFullscreen()
        .catch(
          () => {}
        );

      state.settings.fullscreen =
        false;

    }


    saveGame();

  } catch (error) {}

}


/* =========================================================
   FULLSCREEN BUTTON
   ========================================================= */

function connectFullscreen() {

  const button =
    document.getElementById(
      "fullscreenButton"
    );


  if (!button) return;


  button.addEventListener(
    "click",
    () => {

      playClick();

      toggleFullscreen();

    }
  );

}


/* =========================================================
   VIBRATION
   ========================================================= */

function vibrate(ms = 30) {

  if (
    !state.settings.vibration
  ) {

    return;

  }


  if (
    navigator.vibrate
  ) {

    navigator.vibrate(ms);

  }

}


/* =========================================================
   ATTACK VIBRATION
   ========================================================= */

const originalAttack =
  attack;


function performAttack() {

  originalAttack();

  vibrate(25);

}


/* =========================================================
   PREVENT MOBILE SCROLL DURING GAME
   ========================================================= */

document.addEventListener(
  "touchmove",
  event => {

    const gameScreen =
      document.getElementById(
        "gameScreen"
      );


    if (
      gameScreen &&
      gameScreen.classList
        .contains("active")
    ) {

      event.preventDefault();

    }

  },
  {
    passive: false
  }
);


/* =========================================================
   SAVE BEFORE LEAVING PAGE
   ========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    saveGame();

  }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    loadSettings();

    connectButtons();

    connectGradeButtons();

    connectAudioSliders();

    connectFullscreen();

    initializeJoysticks();

    initializeAttackButton();

    updateCharacterList();

    startIntro();

  }
);


/* =========================================================
   EXTRA GLOBAL FUNCTIONS
   Para gumana ang onclick="" sa HTML
   ========================================================= */

window.newGame =
  newGame;

window.continueGame =
  continueGame;

window.selectGrade =
  selectGrade;

window.selectCharacter =
  selectCharacter;

window.confirmCharacter =
  confirmCharacter;

window.chooseSide =
  chooseSide;

window.pauseGame =
  pauseGame;

window.resumeGame =
  resumeGame;

window.openSettings =
  openSettings;

window.closeSettings =
  closeSettings;

window.saveSettings =
  saveSettings;

window.openShop =
  openShop;

window.backToMenu =
  backToMenu;

window.quitGame =
  quitGame;

window.attack =
  attack;

window.closeCinematic =
  closeCinematic;

window.toggleFullscreen =
  toggleFullscreen;


/* =========================================================
   END
   ========================================================= */
