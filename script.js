let player = document.getElementById('player');  // character
let game = document.getElementById('game');      // main blok
let desert  = document.getElementById('desert'); // bg image
let graund  = document.getElementById('graund'); // caracter ranning graund


function styleing(){	
	desert.removeEventListener('load', styleing);
    game.style.width = desert.width / 2;
    desert.style.left = 0;
    graund.style.left = 0;
    graund.style.top = desert.height - graund.height + 10; // +10 to correct graund position

    player.height = desert.height / 2;
    player.style.top = desert.height - player.height - (player.height * 15 / 100);  // (player.height * 15 / 100) to correct character position
    player.style.left = 20;

    document.getElementById('for-border').style.height = desert.height - 10 + 'px';               //just for borders 
    document.getElementById('for-border').style.width = parseInt(game.style.width) - 20 + 'px';
}


let bgMoveSpeed = 2;
function bgMove(){
	let forestSpeed = bgMoveSpeed;
	let graundSpeed = bgMoveSpeed * 2;
	let forestCurentPosition = parseInt(desert.style.left);	
	let graundCurentPosition = parseInt(graund.style.left);
	
	
	if(forestCurentPosition < 0 - desert.width / 2){
		desert.style.left = 0 - forestSpeed;		
	}
	else {
		desert.style.left = forestCurentPosition - forestSpeed + 'px';		
	}

	if(graundCurentPosition < 0 - graund.width / 2){
		graund.style.left = graundCurentPosition = 0 - graundSpeed;		
	}
	else {
		graund.style.left = graundCurentPosition - graundSpeed + 'px';		
	}    
}

let bgMoveInterval = setInterval(function(){
	bgMove();	
}, 1000 / 35)



// in sprite diferent aactions have diferent images
let playerMoves = {
	Dead: 8,
	Idle: 10,
	Jump: 12,
    Run: 8,
    Walk: 10
}

let action = 'Walk';  // set start action
let previousAction;
let actionStep = 1;  // set first image

function playerMove(){
	player.src = `src/sprite/${action}(${actionStep}).png`;
	actionStep++;
	if(actionStep > playerMoves[action]){
       actionStep = 1;
	}
}


let playerMoveInterval = setInterval(function(){	
	playerMove();
}, 1000 / 10)


document.addEventListener('keydown', actionHundler);
document.addEventListener('keyup', actionReturn);

function actionHundler(){
    if(action == 'Jump') { return false }	//for fix bug when many times click jump button
	previousAction = action;
	// removeing listener to disable bugs when player clicking many times, then returning listener after timeout
	document.removeEventListener('keydown', actionHundler);	

	switch (event.keyCode) {
		case 37:       // left arrow
			idle();
			break;
		case 38:       // up urrow
			jump();
			break;
		case 39:       // right urrow
			run();
			break;					
		default:
			return false;
			break;
	}	
}

function idle(){
	action = 'Idle';	
	clearInterval(bgMoveInterval)
}

function jump(){	
	action = 'Jump';
	actionStep = 1;
	player.style.top = parseInt(player.style.top) - player.height / 2;
		setTimeout(function(){
           player.style.top = parseInt(player.style.top) + player.height / 2;
		}, 500)
	setTimeout(function(){		
		action = previousAction;
		actionStep = 1;
		}, 1000 )	
}


function run(){
	action = 'Run';
	actionStep = 1;
	bgMoveSpeed = 5;
}



function actionReturn(){
	document.addEventListener('keydown', actionHundler);

	if(action == 'Jump') {	
		return;
	}

	else if (action == 'Run') {
		action = 'Walk';
		bgMoveSpeed = 2;
		return;
	}

	else if (action == 'Idle') {
		action = 'Walk';
		bgMoveInterval = setInterval(function(){
	         bgMove();	
           }, 1000 / 35)		
		return;
	}	
}



//preloader
let hiddenBlockForImages = document.getElementById('hiddenBlockForImages');
let totalImages = 51;  //total images
let progress = 0;
for (let move in playerMoves){
	for(let i = 1; i <= playerMoves[move]; i++){
		let image = document.createElement('img');
		image.src = `src/sprite/${move}(${i}).png`;			
		hiddenBlockForImages.appendChild(image);
	}
}

let progressStatus = document.getElementById('progressStatus');
let allImages = Array.from(document.getElementsByTagName('img'));

allImages.forEach(function(image){
	image.addEventListener('load', showProgress)
})


function showProgress(){
			progress += 100 / totalImages;
			progressStatus.innerHTML = Math.ceil(progress);			
			if(Math.ceil(progress) >= 100){			   
               allImages.forEach(function(image){
               	 image.removeEventListener('load', showProgress)
               })
               styleing();
               document.getElementById('preloader').style.visibility = 'hidden';               
			}
		}	
