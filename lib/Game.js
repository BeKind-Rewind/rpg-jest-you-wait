// dependencies
// required run: npm install inquirer@8.2.4 
const inquirer = require("inquirer");
const Enemy = require("./Enemy");
const Player = require("./Player");


function Game () {
    // Game Object's Properties:
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    // currentEnemy & player are currently undefined: will be when method initializeGame() is called
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function () {

    // set array of enemy objects
    this.enemies.push(new Enemy("golin", "sword"));
    this.enemies.push(new Enemy("orc", "bat"));
    this.enemies.push(new Enemy("skeleton", "axe"));
    // to keep track of which Enemy object is currently fighting the Player, when game starts it's the first object in the array
    this.currentEnemy = this.enemies[0];

    // prompt the user for Player name:
    inquirer.prompt(
        {
            text: "text",
            name: "name",
            message: "What is your adventure's name?"
        }
    )
    // destructure name from the prompt object
    // ES6 arrow shorthand is necessary otherwise ".then(function({name}) {})" *function* keyword would have created a new lexical scope where *this* no longer references the Game object 
    // To avoid this problem, use the arrow shorthand for all inquirer callbacks
    .then(({ name }) => {
        this.player = new Player(name);
        
        // test the object creation
        console.log(this.startNewBattle());
    });
}


module.exports = Game;
