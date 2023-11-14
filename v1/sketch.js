let p1, p2, ball;
const playerWidth=20;
const playerHeight=100;
const playerSpeed=8;
const ballWidth=20;
const ballHeight=20;

function setup() {
  this.focus();
  createCanvas(800, 600);
  stroke(255);
  fill(255);
  textSize(120);

  p1 = {
    x: 25,
    y: height/2 - playerHeight/2,
    score: 0
  }
  p2 = {
    x: width - 25 - playerWidth,
    y: height/2 - playerHeight/2,
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
}

function draw() {
  background(0);
  drawScores();

  if(p1.score==11 || p2.score==11) {
    textAlign(CENTER);
    text('GAME OVER', width/2, height/2);
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
  ball.x = width/2;
  ball.y = height/2;
  ball.speed_x = random(4,8) * random([-1,1]);
  ball.speed_y = random(-6,6);
}

function drawPlayer(p) {
  rect(p.x,p.y,playerWidth,playerHeight);
}

function drawBall() {
  rect(ball.x, ball.y, ballWidth, ballHeight);
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
  if(ball.y<=0 || ball.y+ballHeight>=height) {
    ball.speed_y = -1 * ball.speed_y;
  }

  let collision_p1_ball = detect_collision_with_ball(p1);
  if(collision_p1_ball[0]) ball.speed_x = -1 * ball.speed_x;
  if(collision_p1_ball[1]) ball.speed_y = -1 * ball.speed_y;

  let collision_p2_ball = detect_collision_with_ball(p2);
  if(collision_p2_ball[0]) ball.speed_x = -1 * ball.speed_x;
  if(collision_p2_ball[1]) ball.speed_y = -1 * ball.speed_y;

  ball.x = ball.x + ball.speed_x;
  ball.y = ball.y + ball.speed_y;
  
  ball.speed_x = ball.speed_x * (1+ball.accel_x);
  ball.speed_y = ball.speed_y * (1+ball.accel_y);
}

function detect_collision_with_ball(p) {
  const A = {
    pos: [p.x, p.y],
    dim: [playerWidth, playerHeight],
    vel: [0,0]
  }
  const B = {
    pos: [ball.x, ball.y],
    dim: [ballWidth, ballHeight],
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
