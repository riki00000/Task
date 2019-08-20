const log = console.log;

let app = PIXI.autoDetectRenderer(384, 640, {
    transparent: true,
    resoliution: 1
});
let bump = new Bump(PIXI);

document.getElementById('display').appendChild(app.view);

PIXI.loader 
    .add("monster","task-assets/monster.png")
    .add("arrow","task-assets/arrow.png")
    .add("heart","task-assets/heart.png")
    .load(setup);

let stage = new PIXI.Container,
    monsterLives,
    monster,
    arrow,
    arrowSpeed = 5,
    points = 0, // total killed monsters
    hearts = [];

const getHeartSound = new Howl({
    src:'sounds/ouch.mp3'
});

function setup(){
    stage.interactive = true;
    renderObject();
    animationLoop();
}

function animationLoop(){
    requestAnimationFrame(animationLoop);
    //move monster to the bottom
    TweenMax.to(monster, 15, {y: app.height, ease: Power0.easeNone});
    //make hearts to move with monster
    hearts.forEach(function(element){
        element.y = monster.y - 60;
    })
    //chech for colision , only if monster and arrow exist
    if(monster !== undefined && arrow !== undefined){
        if(bump.hit(monster, arrow)){
            //remove heart
            stage.removeChild(hearts[monsterLives-1]);
            hearts.splice(monsterLives-1, 1);
            //get live
            monsterLives -= 1;
            //play sound  
            getHeartSound.play();
            //destroy arrow
            stage.removeChild(arrow);
            arrow = undefined;
        }
    }

    //chech monster's lives
    if(monsterLives == 0){
        //fade out
        fadeObject(monster, 1);
        //render new monster
        renderObject();
        //get point
        points++;
        log("Your Points : " + points);
    }
    // move arrow to the mouse click point with arrowSpeed
    if(arrow !== undefined){
        arrow.x += Math.cos(arrow.rotation )*arrowSpeed;
        arrow.y += Math.sin(arrow.rotation )*arrowSpeed;
    }
    // make monster interactive
    monster.interactive = true;
    // if you click on the monster ,you shoot it with arrow
    monster.click = function(){
        //create arrow
        if(arrow === undefined){
            renderArrow();
        }
    }
    // if you kill 10 monster ,show the confirm window and ask to restart the game
    if(points === 10){
        let answer = window.confirm("Do you want to restart the game?")
        if (answer) {
            location.reload();
        }else{
            points = 0;
        }
    }
    // render container
    app.render(stage);
}


// fade object
function fadeObject(object,duration){
    object.interactive = false;
    TweenMax.to(object, duration, {alpha: 0, onComplete: complete});
    // when animation completed , delete the object
    function complete(){
        stage.removeChild(object);
    }
}

//render monster with hearts
function renderObject(){
    renderMonster();
    renderHearts();
}

// render an arrow
function renderArrow(){
    arrow = new PIXI.Sprite(PIXI.loader.resources["arrow"].texture);
    arrow.anchor.set(0.5, 0.5);
    arrow.scale.set(0.3, 0.3);
    arrow.x = app.width/2;
    arrow.y = app.height - 30;
    arrow.rotation = getAngle({x: arrow.x, y: arrow.y});
    stage.addChild(arrow);
}

// get angle between mouse click and arrow start position (center bot)
function getAngle(arrowPosition){
    let mx = app.plugins.interaction.mouse.global.x,
        my = app.plugins.interaction.mouse.global.y,
        ax = arrowPosition.x,
        ay = arrowPosition.y,
        self = this,
        dist_Y = my - ay,
        dist_X = mx - ax,
        angle = Math.atan2(dist_Y,dist_X);
    return angle;
}

// render a hearts
function renderHearts(){
    for(let i = 0; i < monsterLives; i++){
        let heart = new PIXI.Sprite(PIXI.loader.resources["heart"].texture);
        heart.anchor.set(0.5, 0.5);
        heart.scale.set(0.3, 0.3);
        heart.x = (monster.x - monster.width/2) + (monster.width/6);
        heart.y = monster.y - 60;
        heart.x += (monster.width/3)*i;
        hearts.push(heart);
        stage.addChild(heart);
    }
}

// This function render a monster
function renderMonster(){
    log("render a monster");
    monster = new PIXI.Sprite(PIXI.loader.resources["monster"].texture);
    monster.interactive = true;
    monster.anchor.set(0.5, 0.5);
    monster.scale.set(0.4, 0.4);
    monster.x = getRandomInt(50,app.width - 50);
    monster.y = 100;
    monsterLives = 3;

    stage.addChild(monster);
}

// get random number between min and max vars
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




// DON'T WORK

// function colisionDetection(r1, r2) {
//     let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
//     hit = false;
//     r1.centerX = r1.x + r1.width / 2; 
//     r1.centerY = r1.y + r1.height / 2; 
//     r2.centerX = r2.x + r2.width / 2; 
//     r2.centerY = r2.y + r2.height / 2; 
//     r1.halfWidth = r1.width / 2;
//     r1.halfHeight = r1.height / 2;
//     r2.halfWidth = r2.width / 2;
//     r2.halfHeight = r2.height / 2;
//     vx = r1.centerX - r2.centerX;
//     vy = r1.centerY - r2.centerY;
//     combinedHalfWidths = r1.halfWidth + r2.halfWidth;
//     combinedHalfHeights = r1.halfHeight + r2.halfHeight;
//     if (Math.abs(vx) < combinedHalfWidths) {
//       //A collision might be occuring. Check for a collision on the y axis
//       if (Math.abs(vy) < combinedHalfHeights) {
//         //There's definitely a collision happening
//         hit = true;
//       } else {
//         //There's no collision on the y axis
//         hit = false;
//       }
//     } else {
//       //There's no collision on the x axis
//       hit = false;
//     }
//     //`hit` will be either `true` or `false`
//     return hit;
//   };