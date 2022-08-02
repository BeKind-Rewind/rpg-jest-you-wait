// dependencies
// required run: npm install inquirer@8.2.4 
const inquirer = require("inquirer");
const Enemy = require("../lib/Enemy");
const Player = require("../lib/Player");

class Game {
    constructor(){
        // Game Object's Properties:
        this.roundNumber = 0;
        this.isPlayerTurn = false;
        this.enemies = [];
        // currentEnemy & player are currently undefined: will be when method initializeGame() is called
        this.currentEnemy;
        this.player;
    }

    initializeGame() {
        // set array of enemy objects
        this.enemies.push(new Enemy("goblin", "sword"));
        this.enemies.push(new Enemy("orc", "bat"));
        this.enemies.push(new Enemy("skeleton", "axe"));
        // to keep track of which Enemy object is currently fighting the Player, when game starts it's the first object in the array
        this.currentEnemy = this.enemies[0];
        // prompt the user for Player name:
        inquirer
            .prompt({
                text: "text",
                name: "name",
                message: "What is your adventure's name?"
            })
            // destructure name from the prompt object
            // ES6 arrow shorthand is necessary otherwise ".then(function({name}) {})" *function* keyword would have created a new lexical scope where *this* no longer references the Game object 
            // To avoid this problem, use the arrow shorthand for all inquirer callbacks
            .then(({ name }) => {
                this.player = new Player(name);
        
                this.startNewBattle();
            });
    }

    // Establishes who will take their turn first based on agility values
    startNewBattle() {
        if (this.player.agility > this.currentEnemy.agility){
            this.isPlayerTurn = true;
        } else {
            this.isPlayerTurn = false;
        }

        // prompts the adventure's name to show a table of all their stats
        console.log('Your stats are as follows:');
        console.table(this.player.getStats());
        console.log(this.currentEnemy.getDescription());

        this.battle();
    }

    battle() {
        // startNewBattle established isPlayerTurn
        if (this.isPlayerTurn) {
            // player prompts
            inquirer
                .prompt({
                    type: "list",
                    message: "What would you like to do?",
                    name: "action",
                    choices: ["Attack", "Use potion"]
                })
                .then(({action}) => {
                    if (action === "Use potion"){
                        if (!this.player.getInventory()) {
                            console.log("You don't have any potions!");

                            return this.checkEndOfBattle(); // ends player's turn for not paying attention to their inventory!    
                        }
            
                        inquirer
                            .prompt({
                                type: 'list',
                                message: 'Which potion would you like to use?',
                                name: 'action',
                                choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`) // Add 1 to index for human readability
                            })
                            .then(({ action }) => {
                                // When the user selects a Potion, the returned value will be a string
                                // String.prototype.split() to split string on the ': ', giving us an array with number and Potion name. 
                                const potionDetails = action.split(': ');
                    
                                // Subtracting 1 from the number will put us back at the original array index.
                                this.player.usePotion(potionDetails[0] - 1);
                                console.log(`You used a ${potionDetails[1]} potion.`);
                                this.checkEndOfBattle();
                            });

                    } else {
                        const damage = this.player.getAttackValue();
                        this.currentEnemy.reduceHealth(damage);

                        console.log(`You attacked the ${this.currentEnemy.name}!`);
                        console.log(this.currentEnemy.getHealth());
                        this.checkEndOfBattle();
                    }
                });
        } else {
            const damage = this.currentEnemy.getAttackValue();
            this.player.reduceHealth(damage);
  
            console.log(`You were attacked by the ${this.currentEnemy.name}!`);
            console.log(this.player.getHealth());
            this.checkEndOfBattle();
        }
    }

    checkEndOfBattle() {

        if (this.player.isAlive() && this.currentEnemy.isAlive()) {
            this.isPlayerTurn = !this.isPlayerTurn;
            this.battle();
        } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
            console.log(`You've defeated the ${this.currentEnemy.name}!`);
      
            this.player.addPotion(this.currentEnemy.potion);
            console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion!`);
      
            this.roundNumber++;
      
            if (this.roundNumber < this.enemies.length) {
                this.currentEnemy = this.enemies[this.roundNumber];
                this.startNewBattle();
            } else {
                console.log('You win!');
            }
        } else {
            console.log("You've been defeated!");
        }

    }
}


module.exports = Game;
