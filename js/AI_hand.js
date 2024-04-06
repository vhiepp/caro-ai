const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

const boardCanvas = document.getElementById("board");
const boardCtx = boardCanvas.getContext("2d");

const board = document.getElementById("chess-board");

const level0 = document.getElementById("level0");
const level1 = document.getElementById("level1");
const level2 = document.getElementById("level2");

const DPI = 40;

// Tạo đối tượng hình ảnh
var img1 = new Image();
var img2 = new Image();

var imgLogo = new Image();
imgLogo.src = "../images/logo.png";
const logoSize = 180;

var imgPlayBtn = new Image();
var imgPlayBtnHover = new Image();
var imgPlayBtnClick = new Image();
imgPlayBtn.src = "../images/button/start.png";
imgPlayBtnHover.src = "../images/button/starthover.png";
imgPlayBtnClick.src = "../images/button/startclicked.png";

var imgDeBtn = new Image();
var imgDeBtnHover = new Image();
var imgDeBtnClick = new Image();
imgDeBtn.src = "../images/button/de.png";
imgDeBtnHover.src = "../images/button/deHover.png";
imgDeBtnClick.src = "../images/button/deClicked.png";

var imgTBBtn = new Image();
var imgTBBtnHover = new Image();
var imgTBBtnClick = new Image();
imgTBBtn.src = "../images/button/trungbinh.png";
imgTBBtnHover.src = "../images/button/trungbinhHover.png";
imgTBBtnClick.src = "../images/button/trungbinhClicked.png";

var imgKhoBtn = new Image();
var imgKhoBtnHover = new Image();
var imgKhoBtnClick = new Image();
imgKhoBtn.src = "../images/button/kho.png";
imgKhoBtnHover.src = "../images/button/khoHover.png";
imgKhoBtnClick.src = "../images/button/khoClicked.png";

// Gán nguồn hình ảnh từ tệp
img1.src = "../images/1.png";
img2.src = "../images/2.png";

let mouseX = 0;
let mouseY = 0;

let level = 0;
let selectingLevel = false;
let playing = false;
let currentPlayer = "O";
let cells = ["", "", "", "", "", "", "", "", ""];
let matrix = [
  { i: 0, j: 0 },
  { i: 0, j: 1 },
  { i: 0, j: 2 },
  { i: 1, j: 0 },
  { i: 1, j: 1 },
  { i: 1, j: 2 },
  { i: 2, j: 0 },
  { i: 2, j: 1 },
  { i: 2, j: 2 },
];

const DPI_MIN = (100 - DPI) / 2;
const DPI_MAX = DPI_MIN + DPI;

async function renderBoard() {
  level0.style = "display: none";
  level1.style = "display: none";
  level2.style = "display: none";

  if (level === 0) {
    level0.style = "position: absolute; font-size: 20px; font-weight: bold; top: 5px; color: #1872cc;";
  } else if (level === 1) {
    level1.style = "position: absolute; font-size: 20px; font-weight: bold; top: 5px; color: #056b39;";
  } else {
    level2.style = "position: absolute; font-size: 20px; font-weight: bold; top: 5px; color: red;";
  }

  board.innerHTML = "";
  await cells.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.classList.add("chess-board_cell");
    const cellContent = document.createElement("div");

    cellContent.classList = `chess-board_cell-item ${value}`;

    cellContent.id = `chess-board_cell-${matrix[index].i}-${matrix[index].j}`;
    cellContent.textContent = value;

    cell.appendChild(cellContent);
    board.appendChild(cell);
  });
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some((pattern) => {
    return pattern.every((index) => cells[index] === player);
  });
}

function checkDraw() {
  return cells.every((cell) => cell !== "");
}

function resetGame() {
  level0.style = "display: none";
  level1.style = "display: none";
  level2.style = "display: none";
  board.innerHTML = "";
  cells = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "O";
  click = false;
  playing = false;
}

function aiMove() {
  let availableCells = cells.reduce((acc, value, index) => {
    if (value === "") {
      acc.push(index);
    }
    return acc;
  }, []);
  let randomIndex = Math.floor(Math.random() * availableCells.length);
  cellClick(availableCells[randomIndex]);
}

function aiMove2() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  cellClick(move);
}

function checkResult() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  if (cells.every((cell) => cell !== "")) {
    return "draw";
  }
  return null;
}

function minimax(cells, depth, isMaximizing) {
  let result = checkResult();
  if (result !== null) {
    if (result === "O") {
      return 10 - depth;
    } else if (result === "X") {
      return depth - 10;
    } else {
      return 0;
    }
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === "") {
        cells[i] = "O";
        let score = minimax(cells, depth + 1, false);
        cells[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === "") {
        cells[i] = "X";
        let score = minimax(cells, depth + 1, true);
        cells[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function showPopup(message, playerWin = "BẠN THẮNG") {
  Swal.fire({
    title: playerWin,
    text: message,
    icon: false,
    showConfirmButton: false,
    timer: 4500,
  }).then((result) => {});
}

async function cellClick(index) {
  if (cells[index] === "") {
    cells[index] = await currentPlayer;
    await renderBoard();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    setTimeout(() => {
      if (checkWin(currentPlayer === "X" ? "O" : "X")) {
        click = false;
        playing = false;
        printResult(currentPlayer === "X" ? "O" : "X");

        setTimeout(() => {
          resetGame();
          printBtnPlayScreen(-100, -100);
        }, 4000);
        return;
      }
      if (checkDraw()) {
        click = false;
        playing = false;
        printResult("");

        setTimeout(() => {
          resetGame();
          printBtnPlayScreen(-100, -100);
        }, 4000);
        return;
      }

      if (currentPlayer === "X") {
        setTimeout(() => {
          if (level === 0) {
            const rd = Math.floor(Math.random() * 3);
            if (rd == 0) {
              aiMove2();
            } else {
              aiMove();
            }
          } else if (level === 1) {
            const rd = Math.floor(Math.random() * 2);
            if (rd == 0) {
              aiMove2();
            } else {
              aiMove();
            }
          } else {
            aiMove2();
          }
        }, 200);
      }
    }, 20);
  }
}

let click = false;

function printBtnPlayScreen(mouseX, mouseY) {
  boardCtx.fillStyle = "#fff";
  boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
  // Tạo nút "Chơi Ngay"
  var buttonWidth = 300;
  var buttonHeight = 72;
  var buttonX = (boardCanvas.width - buttonWidth) / 2;
  var buttonY = (boardCanvas.height - buttonHeight) / 2;

  boardCtx.drawImage(imgLogo, (boardCanvas.width - logoSize) / 2, buttonY - (logoSize + 50), logoSize, logoSize);

  if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
    if (click) {
      boardCtx.drawImage(imgPlayBtnClick, buttonX, buttonY, buttonWidth, buttonHeight);
      setTimeout(() => {
        selectingLevel = true;
        printSelectLevelScreen(0, 0);
      }, 500);
    } else {
      boardCtx.drawImage(imgPlayBtnHover, buttonX, buttonY, buttonWidth, buttonHeight);
    }
  } else {
    boardCtx.drawImage(imgPlayBtn, buttonX, buttonY, buttonWidth, buttonHeight);
  }

  if (click) {
    boardCtx.drawImage(img2, mouseX, mouseY, 50, 50);
  } else {
    boardCtx.drawImage(img1, mouseX, mouseY, 50, 50);
  }
}

function printResult(result) {
  if (result === "O") {
    const rd = Math.floor(Math.random() * 4);
    switch (rd) {
      case 0:
        showPopup("Bạn đã chiến thắng 👍👍👍👍👍👍", "BẠN THẮNG");
        break;
      case 1:
        showPopup("Tôi chịu thuiiiiiiii 😭😭😭😭😭😭😭", "BẠN THẮNG");
        break;
      case 2:
        showPopup("Nhường bạn đấy, sợ bạn bị buồn cơ 🙂🙂🙂🙂🙂🙂", "BẠN THẮNG");
        break;
      case 3:
        showPopup("Cờ thủ chính hiệu là bạn 🤙🤙", "BẠN THẮNG");
        break;
      default:
        showPopup("Bạn đã chiến thắng 👏👏👏👏👏👏", "BẠN THẮNG");
        break;
    }
  } else if (result === "X") {
    const rd = Math.floor(Math.random() * 3);
    switch (rd) {
      case 0:
        showPopup("Ahihi! Tớ thắng rồi nhé 😁😁😁😁😁", "MÁY THẮNG");
        break;
      case 1:
        showPopup("Game là dễ 🤭🤭🤭🤭", "MÁY THẮNG");
        break;
      case 2:
        showPopup("Vài đường cơ bản 😜😜😜😜", "MÁY THẮNG");
        break;
      default:
        showPopup("Hihii! Tớ thắng rồi nhé 🥱🥱🥱", "MÁY THẮNG");
        break;
    }
  } else {
    showPopup("Hòa rồi 🥱🥱🥱🥱🥱🥱🥱", "HÒA");
  }
}

function printSelectLevelScreen(mouseX, mouseY) {
  boardCtx.fillStyle = "#fff";
  boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

  var centerX = boardCanvas.width / 2;

  var buttonWidth = 300;
  var buttonHeight = 72;

  const positionYFirstBtn = 500;
  boardCtx.drawImage(
    imgLogo,
    (boardCanvas.width - logoSize) / 2,
    positionYFirstBtn - (logoSize + 50),
    logoSize,
    logoSize
  );

  // Tạo mảng chứa thông tin về các nút
  var buttons = [
    {
      img: {
        btn: imgDeBtn,
        btnHover: imgDeBtnHover,
        btnClick: imgDeBtnClick,
      },
      y: positionYFirstBtn,
      color: "#1f8fff",
      colorHover: "#1872cc",
      colorClick: "#124a82",
    },
    {
      img: {
        btn: imgTBBtn,
        btnHover: imgTBBtnHover,
        btnClick: imgTBBtnClick,
      },
      y: positionYFirstBtn + 72 + 40,
      color: "#088748",
      colorHover: "#056b39",
      colorClick: "#084728",
    },
    {
      img: {
        btn: imgKhoBtn,
        btnHover: imgKhoBtnHover,
        btnClick: imgKhoBtnClick,
      },
      y: positionYFirstBtn + 72 * 2 + 80,
      color: "#fa075d",
      colorHover: "#9e0d40",
      colorClick: "#610827",
    },
  ];

  // Vẽ nút
  buttons.forEach(function (button, index) {
    if (
      mouseX >= centerX - buttonWidth / 2 &&
      mouseX <= centerX + buttonWidth / 2 &&
      mouseY >= button.y &&
      mouseY <= button.y + buttonHeight
    ) {
      if (click) {
        boardCtx.drawImage(button.img.btnClick, centerX - buttonWidth / 2, button.y, buttonWidth, buttonHeight);
        level = index;
        setTimeout(() => {
          printSelectLevelScreen(0, 0);
          playing = true;
          selectingLevel = false;
          click = false;
          renderBoard();
        }, 500);
      } else {
        boardCtx.drawImage(button.img.btnHover, centerX - buttonWidth / 2, button.y, buttonWidth, buttonHeight);
      }
    } else {
      boardCtx.drawImage(button.img.btn, centerX - buttonWidth / 2, button.y, buttonWidth, buttonHeight);
    }
  });

  if (click) {
    boardCtx.drawImage(img2, mouseX, mouseY, 50, 50);
  } else {
    boardCtx.drawImage(img1, mouseX, mouseY, 50, 50);
  }
}

setTimeout(() => {
  printBtnPlayScreen(-100, -100);
}, 2000);

class V3 {
  static distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
    //return dx * dx + dy * dy + dz * dz;
  }
  static sub(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z };
  }
  static add(p1, p2) {
    return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
  }
  static zero() {
    return { x: 0, y: 0, z: 0 };
  }
  static length(p) {
    return Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
  }
  static normalize(p) {
    const l = V3.length(p);
    return { x: p.x / l, y: p.y / l, z: p.z / l };
  }
  static mul(p, n) {
    return { x: p.x * n, y: p.y * n, z: p.z * n };
  }
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  }

  if (results.multiHandLandmarks) {
    if (results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const isLeftHand = landmarks[0].x < landmarks[8].x;
      const handLabel = isLeftHand ? "Phải" : "Trái";

      const test = V3.distance(results.multiHandLandmarks[0][8], results.multiHandLandmarks[0][4]);

      const value = test;
      // console.log(value);
      if (click) {
        if (value >= 0.018) {
          click = false;
        }
      } else {
        if (value < 0.015) {
          click = true;
        }
      }

      if (
        results.multiHandLandmarks[0][0].x * 100 >= DPI_MIN &&
        results.multiHandLandmarks[0][0].x * 100 <= DPI_MAX &&
        results.multiHandLandmarks[0][0].y * 100 >= DPI_MIN &&
        results.multiHandLandmarks[0][0].y * 100 <= DPI_MAX
      ) {
        const coefficientX = ((results.multiHandLandmarks[0][0].x * 100 - DPI_MIN) / DPI) * 100;
        const coefficientY = ((results.multiHandLandmarks[0][0].y * 100 - DPI_MIN) / DPI) * 100;
        const coefficient = 100;
        mouseX = boardCanvas.width - (boardCanvas.width / coefficient) * coefficientX;
        mouseY = (boardCanvas.height / coefficient) * coefficientY;

        if (mouseX < 0) mouseX = 0;
        if (mouseY < 0) mouseY = 0;
        if (mouseX > boardCanvas.width - 25) mouseX = boardCanvas.width - 25;
        if (mouseY > boardCanvas.height - 25) mouseY = boardCanvas.height - 25;
      }

      if (playing && isLeftHand) {
        boardCtx.fillStyle = "#fff";
        boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
        const row = Math.trunc(mouseY / (boardCanvas.width / 3));
        const col = Math.trunc(mouseX / (boardCanvas.width / 3));
        if (click) {
          boardCtx.drawImage(img2, mouseX, mouseY, 50, 50);
        } else {
          boardCtx.drawImage(img1, mouseX, mouseY, 50, 50);
        }
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cell = document.getElementById(`chess-board_cell-${i}-${j}`);
            const index = i * 3 + j;
            if (i === row && j === col) {
              if (click && cells[index].length === 0 && currentPlayer === "O") {
                cell.className = "chess-board_cell-item click";
                cellClick(index);
                click = false;
              } else {
                cell.className = "chess-board_cell-item hover";
              }
            } else {
              cell.className = `chess-board_cell-item ${cells[index]}`;
            }
          }
        }
      } else {
        if (isLeftHand) {
          if (selectingLevel) {
            printSelectLevelScreen(mouseX, mouseY);
          } else {
            printBtnPlayScreen(mouseX, mouseY);
          }
        }
      }
    }

    let sum = 0;
    for (const landmarks of results.multiHandLandmarks) {
      // Từ ngón trỏ đến ngón út (xác định bằng khoảng cách từ số 0)
      const fingers = [8, 12, 16, 20];
      const based = V3.distance(landmarks[0], landmarks[1]);
      const cnt4 = fingers.filter((f) => {
        const d = V3.distance(landmarks[0], landmarks[f]);
        return d / based > 4.5;
      }).length;

      // Phán đoán ngón tay cái (khớp có bị cong hay không)
      const dv = V3.sub(landmarks[3], landmarks[2]);
      const tlen = V3.distance(landmarks[4], landmarks[3]);
      const dv2 = V3.mul(V3.normalize(dv), tlen);
      const pv = V3.add(landmarks[3], dv2);
      const dd = V3.distance(landmarks[4], pv) / based;
      const tcnt = dd < 0.2;

      const cnt = cnt4 + tcnt;
      sum += cnt;
    }

    num_hand = sum;

    // console.log("Tổng ngón tay đang giơ " + sum);
  }

  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 500,
  height: 500,
});
camera.start();
