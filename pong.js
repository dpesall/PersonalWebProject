
var canvas;
var canvasContext;
var ballX = 400;
var ballY = 100;
var ballSpeedX = 10;
var ballSpeedY = 5;

var paddleLeftY = 250;
var paddleRightY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

var leftScore = 0;
var rightScore = 0;
const WINNING_SCORE = 5;

var showingStartScreen = true;
var showingWinScreen = false;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	canvasContext.font = '30px Arial';
	canvas.setAttribute('style', "position: absolute;  left: 50%;margin-left:-400px; top: 50%;margin-top:-300px; border:4px solid yellow");
	var framesPerSecond = 1000 / 60; // 30 FPS
	
	var pause = true;
	var toUnpause = 'Click to start a game.';
	
	setInterval(function () {
		moveEverything();
		drawEverything(); 
	}, framesPerSecond);
	
	canvas.addEventListener('click', handleMouseClick);
	
	canvas.addEventListener('mousemove', 
	function(evt) {
		var mousePos = calculateMousePos(evt);
		paddleLeftY = mousePos.y - (PADDLE_HEIGHT / 2);
	});
	
};

function handleMouseClick(evt) {
	if(showingStartScreen) {
		showingStartScreen = false;
	}
	if(showingWinScreen) {
		leftScore = rightScore = 0;
		showingWinScreen = false;
	}
}

function ballReset() {
	
	if(leftScore >= WINNING_SCORE || rightScore >= WINNING_SCORE) {
		showingWinScreen = true;
	}
	
	ballSpeedY = 5;
	ballSpeedX *= -1;
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

function computerMovement() {
	var paddleRightYCenter = paddleRightY + (PADDLE_HEIGHT / 2);
	if(paddleRightYCenter < ballY - 35) {
		paddleRightY +=7;
	} else if(paddleRightYCenter > ballY + 35){
		paddleRightY -= 7;
	} else {
		
	}
}

function moveEverything() {
	if(showingWinScreen) {
		return;
	}
	computerMovement();
	
	if(ballX >= canvas.width - 25) {
		if(ballY > paddleRightY && ballY < paddleRightY + PADDLE_HEIGHT) {
			ballSpeedX *= -1;
			
			var deltaY = ballY - (paddleRightY + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * .2;
		} else {
			leftScore++;
			ballReset();
		}
	}
	if(ballX <= 25) {
		if(ballY + 5 > paddleLeftY && ballY < paddleLeftY + PADDLE_HEIGHT + 5) {
			ballSpeedX *= -1;
			
			var deltaY = ballY - (paddleLeftY + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * .2;
		} else {
			rightScore++;
			ballReset();
		}
	}
	if(ballY >= canvas.height - 10 || ballY <= 10) {
		ballSpeedY *= -1;
	}
	ballX += ballSpeedX;
	ballY += ballSpeedY;
}

function drawNet() {
	for(var i = 10; i < canvas.height; i += 40) {
		colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
	}
}

function drawEverything() {

	colorRect(0, 0, canvas.width, canvas.height, 'black'); // Screen
	
	canvasContext.fillStyle = 'white';
	canvasContext.textAlign = 'center';
	
	if(showingStartScreen) {
		canvasContext.font = '48px Arial';
		canvasContext.fillText('Pong 1.0 by Drew Pesall', canvas.width / 2, canvas.height / 4);
		canvasContext.font = '30px Arial';
		canvasContext.fillText('Click to start a game.', canvas.width / 2, 3 * canvas.height / 4);
		return;
	}
	
	if(showingWinScreen) {
		if(leftScore >= WINNING_SCORE) {
			canvasContext.fillText('You won!', canvas.width / 2, canvas.height / 4);
		}
		if(rightScore >= WINNING_SCORE) {
			canvasContext.fillText('You lost!', canvas.width / 2, canvas.height / 4);
		}
		
		canvasContext.fillStyle = 'white';
		canvasContext.fillText('Click to start a new game.', canvas.width / 2, 3 * canvas.height / 4);
		return;
	}
	
	drawNet();
	
	colorRect(10, paddleLeftY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // Left Paddle
	
	colorRect(canvas.width - 20, paddleRightY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // Right Paddle
	
	colorCircle(ballX, ballY, 10, 'white'); // Ball
	
	// Scoreboard
	canvasContext.textAlign = 'center';
	canvasContext.fillText(leftScore, canvas.width / 4, 35); 
	canvasContext.fillText(rightScore, 3 * canvas.width / 4, 35); 
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, color) {
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, 10, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY,
	};
	
}

