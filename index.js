


/**
 * SHOOTING GAME
 */
const log = console.log;

class MyEmitter extends EventEmitter {}
let bump = new Bump(PIXI);
let arrowCnt = 0;

// sound "ouch"
const getHeartSound = new Howl({
    src:'sounds/ouch.mp3'
});

class appClass{
    constructor(){
        log("app")
        this.app = PIXI.autoDetectRenderer(384, 640, {
            transparent: true,
            resolution: 1
        });
        this.counter = 0;
        this.monsterArray = new Array();
        document.getElementById('display').appendChild(this.app.view);
        this.MyEmitter = new MyEmitter();
        this.MyEmitter.on('renderMonster', () => {
            console.log('an event occurred!');
            this.monster = new monsterClass("task-assets/monster.png", getRandomInt(50, this.app.width - 50), 100, 3)
            this.monsterArray.push(this.monster);
            log(this.monsterArray);
            this.stage.addChild(this.monster.object);
            this.counter = 0;
        }); 
        this.stage = new PIXI.Container;
 
        
    }
    render(){
        this.animationLoop();
    }
  
    animationLoop(){
        this.counter += 1;
        if(this.counter === 200){
            this.MyEmitter.emit('renderMonster');
        }
        // this.monsterArray.forEach(function(element){
        //     if(element.object != "undefined" && element.object.arrow.object != "undefined"){
        //         colisionMonsterAndArrow(element.object, element.object.arrow.object);
        //     }
        // });
        window.requestAnimationFrame(this.animationLoop.bind(this));
        this.app.render(this.stage);
    }
}

class monsterClass{
    constructor(imageUrl, x, y, livesNum){
        log("render a monster");
        this.object =new PIXI.Sprite.fromImage(imageUrl);
        this.object.buttonMode = true;
        this.object.anchor.set(0.5, 0.5);
        this.object.scale.set(0.4, 0.4);
        this.object.x = x;
        this.object.y = y;
        this.object.interactive = true;
        this.object.lives =new Array();
        renderHearts(this.object, livesNum, this.object.lives);
        this.object.on('mousedown', this.onDown );
        this.object.on('create', this.onCreate(this.object) );
        
        

    }
    onCreate(obj){
        TweenMax.to(obj, 15, {y: game.app.height, ease: Power0.easeNone});
    }
    onDown(eventData) {
        if(arrowCnt < 2){
            log("clicked");
            this.arrow = new arrowClass("task-assets/arrow.png");
            game.stage.addChild(this.arrow.object);
            arrowCnt++;
        }
        
    }
    set lives(newLives){
        this.object.lives = newLives;
    }
    get lives(){
        return this.object.lives;
    }
    set x(newX){
        this.object.x = newX;
    }
    get x(){
        return this.object.x;
    }
    set y(newY){
        this.object.y = newY;
    }
    get y(){
        return this.object.y;
    }
    update(){
        array.forEach(element => {
            
        });
        colisionMonsterAndArrow()
    }
}

class arrowClass{
    constructor(imageUrl){
        this.object =new PIXI.Sprite.fromImage(imageUrl);
        this.object.x = game.app.width/2;
        this.object.y = game.app.height -30;
        this.object.clickedX =  game.app.plugins.interaction.mouse.global.x;
        this.object.clickedY =  game.app.plugins.interaction.mouse.global.y;
        this.object.rotation = getAngle({x: this.object.x, y: this.object.y}, this.object.clickedX, this.object.clickedY);
        this.object.anchor.set(0.5, 0.5);
        this.object.scale.set(0.3, 0.3);
        this.object.on('load', this.onCreate(this.object) );
    }
    onCreate(obje){
        TweenMax.to(obje, 3, {x: this.object.clickedX, y: this.object.clickedY, ease: Power0.easeNone, onComplete: function(){game.stage.removeChild(obje); arrowCnt--;}});
    }
    set x(newX){
        this.object.x = newX;
    }
    get x(){
        return this.object.x;
    }
    set y(newY){
        this.object.y = newY;
    }
    get y(){
        return this.object.y;
    }
}



let game = new appClass;
game.render();



// set up the events if we have a colision between monster and arrow
function colisionMonsterAndArrow(monster, arrow){
    if(monster !== undefined && arrow !== undefined){
        if(bump.hit(monster, arrow)){
            log("colision ok");

            // //remove heart
            // stage.removeChild(hearts[monsterLives-1]);
            // hearts.splice(monsterLives-1, 1);
            // //get live
            // monsterLives -= 1;
            // //play sound  
            // getHeartSound.play();
            // //destroy arrow
            // stage.removeChild(arrow);
            // arrow = undefined;
            // // vibrate fow 300 ms
            // window.navigator.vibrate(300);
        }
    }
}

// get angle between mouse click and arrow start position (center bot)
function getAngle(arrowPosition){
    let mx = game.app.plugins.interaction.mouse.global.x,
        my = game.app.plugins.interaction.mouse.global.y,
        ax = arrowPosition.x,
        ay = arrowPosition.y,
        dist_Y = my - ay,
        dist_X = mx - ax,
        angle = Math.atan2(dist_Y,dist_X);
    return angle;
}

// render a hearts
function renderHearts(monster, monsterLives, array){
    log("render hearts")
    for(let i = 0; i < monsterLives; i++){
        let heart = new PIXI.Sprite.fromImage("task-assets/heart.png");
        heart.anchor.set(0.5, 0.5);
        heart.scale.set(0.3, 0.3);
        heart.x = (monster.x - monster.width/2) + (monster.width/6);
        heart.y = monster.y - 60;
        heart.x += (monster.width/3)*i;
        array.push(heart);
        game.stage.addChild(heart);
    }
}

// get random number between min and max vars
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// if you kill 10 monster ,show the confirm window and ask to restart the game
function chechPoints(points){
    if(points === 10){
        let answer = window.confirm("Do you want to restart the game?");
        //vibrate for 500ms
        window.navigator.vibrate(500);
        if (answer) {
            location.reload();
        }else{
            points = 0;
        }
    }
}

// fade object
function fadeObject(object,duration){
    object.interactive = false;
    TweenMax.to(object, duration, {alpha: 0, onComplete: complete});
    // when animation completed , delete the object
    function complete(){
        game.stage.removeChild(object);
    }
}

// function chechMonsterLives(){
//     if(monsterLives == 0){
//         //fade out
//         fadeObject(monster, 1);
//         //render new monster
//         renderObject();
//         //get point
//         points++;
//         log("Your Points : " + points);
//     }
// }

