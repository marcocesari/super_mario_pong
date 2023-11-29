let p1, p2, p1_image, p2_image, p1_sounds, p2_sounds;
let bkg;
let ball, ball_image, ball_sound;
let game_status, game_over_sound;
const playerSpeed=8;

function preload() {
  bkg = loadImage('assets/background_jump.jpg');
  ball_image = loadImage('assets/coin.png');
  ball_sound = loadSound('assets/smw_coin.wav');
  game_over_sound = loadSound('assets/smb_gameover.wav');
  p1_image = loadImage('assets/mario_right.png');
  p2_image = loadImage('assets/luigi_left.png');
  
  mario = loadSound('assets/mario.m4a');
  luigi = loadSound('assets/luigi.m4a');
  mammamia = loadSound('assets/mammamia.m4a');
  wow = loadSound('assets/wow.m4a');
  ok = loadSound('assets/ok.m4a');
  letsgo = loadSound('assets/letsgo.m4a');
  p1_sounds = [mario, mammamia, wow, ok, letsgo];
  p2_sounds = [luigi, mammamia, wow, ok, letsgo];
}

function setup() {
  this.focus();
  createCanvas(800, 600);
  stroke(0,0,100);
  fill(255);
  textSize(120);

  p1 = {
    image: p1_image,
    sounds: p1_sounds,
    x: 25,
    y: height/2 - p1_image.height/2,
    score: 0
  }
  p2 = {
    image: p2_image,
    sounds: p2_sounds,
    x: width - 25 - p2_image.width,
    y: height/2 - p2_image.height/2,
    score: 0
  }
  ball = {
    x: width/2,
    y: height/2,
    speed_x: 4,
    speed_y: 4,
    accel_x: 0.001,
    accel_y: 0.001
  }
  game_status = 'play';

  
}

function draw() {
  background(bkg);
  drawScores();

  if(p1.score==11 || p2.score==11) {
    textAlign(CENTER);
    text('GAME OVER', width/2, height/2);
    if(game_status=='play') {
      game_over_sound.play();
    }
    game_status = 'game over';
    return;
  } 

  movePlayers();
  drawPlayer(p1);
  drawPlayer(p2);

  moveBall();
  drawBall();

  if(ball.x<0) {
    p2.score = p2.score + 1;
    nextRound();
  }
  if(ball.x>width) {
    p1.score = p1.score + 1;
    nextRound();
  }
}

function drawScores() {
  text(p1.score, 250, 100);
  text(p2.score, 490, 100);
}

function nextRound() {
  ball_sound.play();
  ball.x = width/2;
  ball.y = height/2;
  ball.speed_x = random(4,8) * random([-1,1]);
  ball.speed_y = random(-6,6);
}

function drawPlayer(p) {
  image(p.image, p.x, p.y);
}

function drawBall() {
  image(ball_image, ball.x, ball.y);
}

function movePlayers() {
  if (keyIsDown(UP_ARROW)) {
    p2.y = p2.y - playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    p2.y = p2.y + playerSpeed;
  }

  // https://www.toptal.com/developers/keycode
  const keyCodeA=65;
  const keyCodeZ=90;
  if (keyIsDown(keyCodeA)) {
    p1.y = p1.y - playerSpeed;
  }
  if (keyIsDown(keyCodeZ)) {
    p1.y = p1.y + playerSpeed;
  } 
}

function moveBall() {
  if(ball.y<=0 || ball.y+ball_image.height>=height) {
    ball.speed_y = -1 * ball.speed_y;
  }

  for(let p of [p1, p2]) {
    let collision = detect_collision_with_ball(p);
    if(collision[0]) ball.speed_x *= -1;
    if(collision[1]) ball.speed_y *= -1;
    if(collision[0] || collision[1]) {
      random(p.sounds).play();
      while(collision[0] || collision[1]) {
        ball.x = ball.x + ball.speed_x;
        ball.y = ball.y + ball.speed_y;
        collision = detect_collision_with_ball(p);
      }
    }
  }

  ball.x = ball.x + ball.speed_x;
  ball.y = ball.y + ball.speed_y;
  
  ball.speed_x = ball.speed_x * (1+ball.accel_x);
  ball.speed_y = ball.speed_y * (1+ball.accel_y);
}

function detect_collision_with_ball(p) {
  const A = {
    pos: [p.x, p.y],
    dim: [p.image.width, p.image.height],
    vel: [0,0]
  }
  const B = {
    pos: [ball.x, ball.y],
    dim: [ball_image.width, ball_image.height],
    vel: [ball.speed_x, ball.speed_y]
  }
  return detect_collision(A,B);
}

function detect_collision(A,B) {
  let collision_along_x_axis = false;
  let collision_along_y_axis = false;

  // If A and B keep moving in current X direction, are they going to collide?
  if (A.pos[0] + A.dim[0] + A.vel[0] > B.pos[0]            + B.vel[0] && 
      A.pos[0]            + A.vel[0] < B.pos[0] + B.dim[0] + B.vel[0] && 
      A.pos[1] + A.dim[1]            > B.pos[1]                       && 
      A.pos[1]                       < B.pos[1] + B.dim[1]) {
    collision_along_x_axis = true;
  }
  // If A and B keep moving in current Y direction, are they going to collide?
  if (A.pos[0] + A.dim[0]            > B.pos[0]                       && 
      A.pos[0]                       < B.pos[0] + B.dim[0]            && 
      A.pos[1] + A.dim[1] + A.vel[1] > B.pos[1]            + B.vel[1] && 
      A.pos[1]            + A.vel[1] < B.pos[1] + B.dim[1] + B.vel[1]) {
    collision_along_y_axis = true;
  }
  return [collision_along_x_axis, collision_along_y_axis];
}
