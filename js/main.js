'use stricts';

{
  // 落ちるスピード
  const GAME_SPEED = 500;

  // フィールドサイズ
  const FIELD_COL = 10;
  const FIELD_ROW = 20;
  
  // ブロックサイズ
  const BLOCK_SIZE = 30;

  // キャンバスサイズ
  const SCREEN_W = BLOCK_SIZE * FIELD_COL;
  const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

  // テトロミノサイズ
  const TETRO_SIZE = 4;

  // キャンバス取得
  let can = document.getElementById("can");
  let con = can.getContext("2d");

  can.width = SCREEN_W;
  can.height = SCREEN_H;
  can.style.border = "4px solid #555";

  const TETRO_COLORS =[
    "#000", //0 empty
    "#6CF", //1 skyblue
    "#F92", //2 orage
    "#66F", //3 blue
    "#C5C", //4 parple
    "#5B5", //5 green
    "#FD2", //6 yellow
    "#F44", //7 red
  ];

  const TETRO_TYPES =[
    // 0 empty
    [],
    // 1 I
    [
      [0, 0, 0, 0,],
      [1, 1, 1, 1,],
      [0, 0, 0, 0,],
      [0, 0, 0, 0,]
    ],
    // 2 L
    [
      [0, 1, 0, 0,],
      [0, 1, 0, 0,],
      [0, 1, 1, 0,],
      [0, 0, 0, 0,]
    ],
    // 3 J
    [
      [0, 0, 1, 0,],
      [0, 0, 1, 0,],
      [0, 1, 1, 0,],
      [0, 0, 0, 0,]
    ],
    // 4 T
    [
      [0, 1, 0, 0,],
      [0, 1, 1, 0,],
      [0, 1, 0, 0,],
      [0, 0, 0, 0,]
    ],
    // 5 O
    [
      [0, 0, 0, 0,],
      [0, 1, 1, 0,],
      [0, 1, 1, 0,],
      [0, 0, 0, 0,]
    ],
    // 6 Z
    [
      [0, 0, 0, 0,],
      [1, 1, 0, 0,],
      [0, 1, 1, 0,],
      [0, 0, 0, 0,]
    ],
    // 7 S
    [
      [0, 0, 0, 0,],
      [0, 1, 1, 0,],
      [1, 1, 0, 0,],
      [0, 0, 0, 0,]
    ],   
  ];

  const START_X = FIELD_COL/2 - TETRO_SIZE/2;
  const START_Y = 0;
  
  // テトロミノ本体
  let tetro;
  
  // テトリミノ座標
  let tetro_x = START_X;
  let tetro_y = START_Y;

  // テトロミノの形
  let tetro_t;
  
  // フィールド中身
  let field = [];

  // ゲームオーバーフラグ
  let over = false;

  const score_t = document.getElementById("score");

  tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;

  // 重複回避
  function tetro_lng() {
    newtetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
    if (tetro_t === newtetro_t) {
      return tetro_t++;
    } else if (tetro_t === newtetro_t || tetro_t === 8) {
     const max = 8;
     const min = 1;
     return tetro_t = tetro_t - Math.floor(Math.random() * (max - min)) + min;
    }
  }

  tetro = TETRO_TYPES[tetro_t];
  init();
  drawAll();

  setInterval(dropTetro, GAME_SPEED);
  // 初期化
  function init(){
    for (let y=0; y<FIELD_ROW; y++) {
      field[y] = [];
      for (let x=0; x<FIELD_COL; x++) {
        field[y][x] = 0;
      }
    }
    // テスト
    // field[19][0] = 1;
    // field[5][5] = 1;
    // field[19][9] = 1;
  }

  


  // ブロック一つ描画
  function drawBlock(x,y,c) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
      
    con.fillStyle=TETRO_COLORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle="black";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  }

  // すべて描画
  function drawAll() {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);

    // フィールド描画
    for (y=0; y<FIELD_ROW; y++) {
      for (x=0; x<FIELD_COL; x++) {
        if ( field[y][x] ){ 
          drawBlock(x,y, field[y][x]);
        }
      }
    }

    // テトロミノ描画
    for (let y=0; y<TETRO_SIZE; y++) {
      for (let x=0; x<TETRO_SIZE; x++) {
        if ( tetro[y][x] == 1){
          drawBlock(tetro_x+x, tetro_y+y, tetro_t);
        }
      }
    }

    if (over) {

      let s = "GAME OVER"
      con.font = "40px 'ＭＳ ゴシック'";
      let w = con.measureText(s).width;
      let x = SCREEN_W/2 - w/2;
      let y = SCREEN_H/2 - 20;
      con.lineWidth = 4;
      con.strokeText(s,x,y);
      con.fillStyle="white";
      con.fillText(s,x,y);
      window.open('https://twitter.com/t93hound', '_blank');
    }
  }

    // 衝突判定
  function checkMove(mx, my, newtetro) {
    if (newtetro == undefined) {
      newtetro = tetro;
    }
    for (let y=0; y<TETRO_SIZE; y++) {
      for (let x=0; x<TETRO_SIZE; x++) {
        if (newtetro[y][x]){
          let nx = tetro_x + mx + x;
          let ny = tetro_y + my + y;
          if (ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  // テトロミノ回転
  function rotate() {
    let newtetro = [];
    for (let y=0; y<TETRO_SIZE; y++) {
      newtetro[y] =[];
      for (let x=0; x<TETRO_SIZE; x++) {
        newtetro[y][x] = tetro[TETRO_SIZE-x-1][y];
      }
    }
    return newtetro;
  }

  // テトロミノ固定
  function fixTetro() {
    for (let y=0; y<TETRO_SIZE; y++) {
      for (let x=0; x<TETRO_SIZE; x++) {
        if(tetro[y][x]) {
          field[tetro_y + y][tetro_x + x] = tetro_t;
        }
      }
    }    
  }

  // ラインが揃ったかチェックして消す
  function checkLine() {
    linec = 0;
    for (let y=0; y<FIELD_ROW; y++) {
      let flag = true;
      for (let x=0; x<FIELD_COL; x++) {
        if (!field[y][x]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        linec++;
        for(let ny = y; ny > 0; ny--) {
          for(let nx = 0; nx < FIELD_COL; nx++) {
            field[ny][nx] = field[ny-1][nx];
          }
        }
      }
    }
  }

  // ブロックの落ちる処理
  function dropTetro() {
    if (over) {
      window.open('https://twitter.com/t93hound', '_blank');
      return;
    }
    if (checkMove(0, +1)) {
      tetro_y++;
    } else {
      fixTetro();
      checkLine();
      tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
      tetro_lng();
      tetro = TETRO_TYPES[tetro_t];
      tetro_x = START_X;
      tetro_y = START_Y;

      if (!checkMove(0,0)) {
        over = true;
      }
    }
    drawAll();
  }

  // キーボードの処理
  document.onkeydown = function(e) {
    if (over) {
      window.open('https://twitter.com/t93hound', '_blank');
      return;
    }
    switch(e.keyCode) {
      case 65: //left a
        if (checkMove(-1, 0)) {
          tetro_x--;
        }
      break;
      case 87: //up w
        if (checkMove(0, -1)){
          tetro_y--;
        }
      break;
      case 68: //right d
        if (checkMove(+1, 0)) {
          tetro_x++;
        }
      break;
      case 83: //under s
        if (checkMove(0, +1)) {
          tetro_y++;
        }
      break;
      case 16: //under shift
        while (checkMove(0, +1)) {
          tetro_y++;
        }
      break;
      
      case 32: //rotation space
       let newtetro = rotate();
       if (checkMove(0, 0, newtetro)) {
         tetro = newtetro;
       }
      break;
    }

    drawAll();
  }

}