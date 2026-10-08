'use strict'

let numOfGooberts = 0;
const MAX_EYE_TYPES = 10;
const MAX_BODY_TYPES = 7;
const MAX_LEG_TYPES = 7;
const MAX_MOUTH_TYPES = 11;
const MAX_COLORS = 7;

const BODY_SPRITE_SHEET = 'assets/goobert-parts/208-tamagotchi-bodies.png';
const LEG_SPRITE_SHEET = 'assets/goobert-parts/208-tamagotchi-legs.png';
const EYES_SPRITE_SHEET = 'assets/goobert-parts/208-tamagotchi-eyes.png';
const MOUTH_SPRITE_SHEET = 'assets/goobert-parts/208-tamagotchi-mouths.png';



class goobert {
    constructor(name, xLoc = 0, yLoc = 0) {
        this.name = name,
        this.antihunger = 0, // Eating, catch the food game
        this.swagosity = 50, // Boredom, Snake
        this.snooziness = 50, // Sleeping
        this.cleanliness = 50, // Bathing, Flappy Goobert
        this.xLocation = xLoc, //Where the goobert is
        this.yLocation = yLoc,

        /* Sprite builder properties */
        this.goobertId = this.name + numOfGooberts,
        this.bodyId = this.goobertId + "body",
        this.legId = this.goobertId + "legs",
        this.eyeId = this.goobertId + "eyes",
        this.mouthId = this.goobertId + "mouth",

        /* Setting assets to random index based on how many types/colors there currently are*/
        this.bodyType = Math.floor(Math.random() * MAX_BODY_TYPES),
        this.bodyColor = Math.floor(Math.random() * MAX_COLORS),
        this.legType = Math.floor(Math.random() * MAX_LEG_TYPES),
        this.legColor = Math.floor(Math.random() * MAX_COLORS),
        this.eyeType = Math.floor(Math.random() * MAX_EYE_TYPES),
        this.mouthType = Math.floor(Math.random() * MAX_MOUTH_TYPES);
        this.eyeExpression = 0;
        this.mouthExpression = 0;

        this.initializeSprite();

        numOfGooberts++;
    }


    sleep() {
        this.snooziness = 100;
        console.log(this);
    }
    eat() {
        this.antihunger >= 100 ? 100 : this.antihunger += 10;
        console.log(this);
    }
    bathe(){

    }


    /* Inserts the sprite HTML and sets up the styles */
    initializeSprite(){
        let htmlString = `<div>
						<img id="${this.legId}" src="assets/goobert-parts/Transparent-BG.png"/>
						<img id="${this.bodyId}" src="assets/goobert-parts/Transparent-BG.png"/>
						<img id="${this.mouthId}" src="assets/goobert-parts/Transparent-BG.png"/>
						<img id="${this.eyeId}" src="assets/goobert-parts/Transparent-BG.png"/>
                        <img id="${this.goobertId}" src="assets/goobert-parts/Transparent-BG.png" onclick="${this.name}.onClick()"/>
					</div>`;
        document.getElementById("main").innerHTML += htmlString;
        console.log(this.name + " exists now.");
        
        const elemIds = [this.legId, this.bodyId, this.mouthId, this.eyeId, this.goobertId];
        let len = elemIds.length;

        for (let id = 0; id < len; id++) {
            document.getElementById(elemIds[id]).style.width = '64px';
            document.getElementById(elemIds[id]).style.height = '64px';
            document.getElementById(elemIds[id]).style.imageRendering = 'crisp-edges';
            document.getElementById(elemIds[id]).style.position = 'fixed';
            console.log("Set " + elemIds[id] + "'s properties.");
        }
        
        
        document.getElementById(this.legId).style.backgroundImage = `url(${LEG_SPRITE_SHEET})`;
        document.getElementById(this.bodyId).style.backgroundImage = `url(${BODY_SPRITE_SHEET})`;
        document.getElementById(this.eyeId).style.backgroundImage = `url(${EYES_SPRITE_SHEET})`;
        document.getElementById(this.mouthId).style.backgroundImage = `url(${MOUTH_SPRITE_SHEET})`;

        document.getElementById(this.legId).style.zIndex = '1';
        document.getElementById(this.bodyId).style.zIndex = '2';
        document.getElementById(this.eyeId).style.zIndex = '3';
        document.getElementById(this.mouthId).style.zIndex = '4';
        document.getElementById(this.goobertId).style.zIndex = '5';

        this.setPosition();
        this.setBodyType();
        this.setBodyColor();
        this.setLegsType();
        this.setLegsColor();
        this.setEyes();
        this.setEyeExpression();
        this.setMouth();
        this.setMouthExpression();
        
    }

        /* The following functions set the features of the 
           goobert using their element ids and asset index.  */

    setBodyType(){
        const element = document.getElementById(this.bodyId);
        element.style.backgroundPositionY = (this.bodyType*(-64)) + 'px';
        console.log(this.name + "'s body type set.");
    }

    setBodyColor(){
        const element = document.getElementById(this.bodyId);
        element.style.backgroundPositionX = (this.bodyColor*(-64)) + 'px';
        console.log(this.name + "'s body color set.");
    }

    setLegsType(){
        const element = document.getElementById(this.legId);
        element.style.backgroundPositionY = (this.legType*(-64)) + 'px';
        console.log(this.name + "'s leg type set.");
    }

    setLegsColor(){
        const element = document.getElementById(this.legId);
        element.style.backgroundPositionX = (this.legColor*(-64)) + 'px';
        console.log(this.name + "'s leg color set.");
    }

    setEyes(){
        const element = document.getElementById(this.eyeId);
        element.style.backgroundPositionY = (this.eyeType*(-64)) + 'px';
        console.log(this.name + "'s eye type set.");
    }
    setEyeExpression(){
        const element = document.getElementById(this.eyeId);
        element.style.backgroundPositionX = (this.eyeExpression*(-64)) + 'px';
        console.log(this.name + "'s eye expression set.");
    }

    setMouth(){
        const element = document.getElementById(this.mouthId);
        element.style.backgroundPositionY = (this.mouthType*(-64)) + 'px';
        console.log(this.name + "'s mouth type set.");
    }
    setMouthExpression(){
        const element = document.getElementById(this.mouthId);
        element.style.backgroundPositionX = (this.mouthExpression*(-64)) + 'px';
        console.log(this.name + "'s mouth expression set.");
    }


    /* Sets the position of the sprite */
    setPosition(){
        const elemIds = [this.legId, this.bodyId, this.mouthId, this.eyeId, this.goobertId];
        let len = elemIds.length;

        for (let id = 0; id < len; id++) {
            document.getElementById(elemIds[id]).style.top = this.yLocation;
            document.getElementById(elemIds[id]).style.left = this.xLocation;
            console.log("Set " + elemIds[id] + "'s position.");
        }
    }

    /* Will trigger only for a particular instance of a goobert when the sprite is clicked */
    onClick(){
        console.log(`${this.name} says, "I've been poked!"`);
    }
}




