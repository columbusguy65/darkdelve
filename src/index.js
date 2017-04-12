
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports one lauguages. (en-US).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs
 **/

'use strict';
var rooms = require("./quest");

var startRoom = rooms.quest.page[0];
var numLinks = startRoom.links.link.length;
var eastLink,westLink, northLink,southLink,upLink,downLink;

for (var i = 0; i < numLinks; i++) 
{
    switch (startRoom.links.link[i]['#text'])
    {
    case 'East':
        eastLink= startRoom.links.link[i]['-id'];
        break;
     case 'West':
        westLink= startRoom.links.link[i]['-id'];
        break;
    case 'North':
        northLink= startRoom.links.link[i]['-id'];
        break;
    case 'South':
        southLink= startRoom.links.link[i]['-id'];
        break; 
    case 'Up':
        upLink= startRoom.links.link[i]['-id'];
        break;
     case 'Down':
        downLink= startRoom.links.link[i]['-id'];
        break;         
    };
}

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.f502aa7c-92e5-4a93-ad0c-677dd44c34ad'

const languageStrings = {
    'en-US': {
        translation: {
            WEST_MSG: 'West',
            EAST_MSG: 'East',
            NORTH_MSG: 'North',
            SOUTH_MSG: 'South',
            UP_MSG: 'You climb up the ladder. ',
            DOWN_MSG: 'You climb down the ladder. ',
            OPENING_MOVE: 'Your move!  What would you like to do? ',
            BRIEF_MSG: 'This mode will tell you a condensed version of everything. Good if you drank too much coffee.',
            EXIT_ONE: 'There is one exit to the ',
            EXIT_MULTI: 'There are exits to the ',
            EXIT_NONE: 'There are no exits to this room. Sorry. ',
            EQUIP_MSG: 'You equipped item ',
            HEAL_MSG: 'You attempt to heal yourself and are successful. ',
            HELP_MSG: "No help for you! ",
            HELP_REPROMPT: 'What can I help you with? ',
            MOVE_MSG: 'You gather your energy and move ',
            NO_MSG: 'You said no. ',
            NORMAL_MSG: 'This mode will tell you a decent amount of detail without the numbers. ',
            NOT_IMPLEMENTED: ' has not been implemented. ',
            PAUSE_MSG: 'I will pause the game for you. Say resume to continue. ',
            PIT_MSG: 'You fell in a spiked pit!! Your lifeless, and highly punctured corspse is never found. The End!',
            RESUME_MSG: 'Resuming your adventure.  ',
            REPROMPT: 'What would you like to do now?',
            SKILL_NAME: "dark delve",
            SLEEP_MSG: 'I would not try to sleep in here, with all the monsters wandering around. ',
            START_MSG: "Welcome to Dark Delve. You can say begin adventure. ",
            STOP_MSG: 'Only cowards are afraid of the dark! Goodbye! ',
            LUDACRIS_MSG: 'This mode will give you all the rolls and modifiers. ',
            VERSION_MSG: 'This is an on going project which will have many versions. The current version is one dot zero. ',
            YES_MSG: 'You said yes. ', 
            COMMANDS: 'ATTACK, BRIEF, CLOSE, DEFEND, DESCRIBE, DROP,' +
            'EQUIP, EXAMINE, GET, HEAL, HIT, LISTEN, LOOK, LUDACRIS, MOVE, NORMAL, OPEN, READ, RUN,'+
            'SEARCH, SLEEP, TAKE, TOUCH,  USE, VERSION, WEAR ',
             FUTURE_COMMANDS: 'AGAIN, BRIEF, CLOSE, DRINK, EAT,FLEE, GIVE, JUMP, KILL,' +
            ' LICK, LISTEN,PEER, PULL, PUNCH, PUSH, PUT, RECAP, REMOVE, REPEAT,' +
            'SHEATH, SHOW, SIT, SMACK, SMELL, TASTE, THROW, TOUCH, TURN',
        },
    },
    
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('Welcome');
        console.log('launched!');
    },
    'AttackIntent': function () {
        this.emit('Attack'); //attack, hit, defend, run
    },
    'BeginIntent': function(){
        this.emit('Begin');
    },
    'BreadCrumbIntent': function () {
        this.emit('BreadCrumb');
    },
    'CommandIntent': function () {
        this.emit('Command'); 
    },
    'EquipIntent': function () {
        this.emit('Equip');//equip, wear
    }, 
    'ExploreIntent': function () {
        this.emit('Equip'); //look, listen,  describe, read, search, touch
    },
    'InteractIntent': function () {
        this.emit('Equip'); //close, drop, examine, get, open, use, take
    },
    'ListCommandsIntent': function(){
        this.emit('ListCommands');
    },
    'MoveIntent': function () {
        this.emit('Move');
    },
    'SetModeIntent': function () {
        this.emit('SetMode');
    },
    'VersionIntent': function () {
        this.emit('Version');
    },
    'Welcome': function() {
        // Create speech output
        var speechOutput = this.t('START_MSG');
         var reprompt = this.t('REPROMPT');
         this.emit(':ask', speechOutput, reprompt);
    },
    'Begin': function (){
        var speechOutput = startRoom.desc + " ";
     
        if (numLinks == 0){
            speechOutput = speechOutput + this.t('EXIT_NONE')
        };
        
        if (numLinks == 1) {
                speechOutput = speechOutput + this.t('EXIT_ONE') + startRoom.links.link[0]['#text']
            }
         else
         {  
             speechOutput = speechOutput + this.t('EXIT_MULTI') 
             for (var i = 0; i < numLinks; i++) {
                speechOutput = speechOutput + startRoom.links.link[i]['#text']
                if (i != numLinks -1)
                {
                   speechOutput = speechOutput + ", and "
                 };
            };
         };
        //this.emit(':tell', speechOutput + "!!");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },

     'Command': function() { //   heal, sleep
        var item = this.event.request.intent.slots.word.value;
         // Create speech output
       // var speechOutput = item + this.t("NOT_IMPLEMENTED");
       var speechOutput;
       switch (item)
            {
            case 'heal':
                speechOutput = this.t("HEAL_MSG");
            break;
            case 'sleep':
                speechOutput = this.t("SLEEP_MSG");
            break;
        };
        speechOutput = speechOutput + this.t("REPROMPT");
        this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
    
    'Equip': function() {
        var item = this.event.request.intent.slots.item.value;
         // Create speech output
        var speechOutput = this.t("EQUIP_MSG") + item;
        speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
    
     'ListCommands': function() {
         // Create speech output
        const speechOutput = this.t("COMMANDS");
        speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
    
    'Move': function() {
        var direction = this.event.request.intent.slots.direction.value;
         // Create speech output
        var speechOutput = this.t("MOVE_MSG");
        switch(direction)
        {
            case 'west':
                speechOutput = speechOutput + this.t("WEST_MSG");
            break;
            case 'east':
                speechOutput = speechOutput + this.t("EAST_MSG");
            break;
            case 'north':
                speechOutput = speechOutput + this.t("NORTH_MSG");
            break;
            case 'south':
                speechOutput = speechOutput + this.t("SOUTH_MSG");
            break;
            case 'up':
                speechOutput = speechOutput + this.t("UP_MSG");
            break;
            case 'down':
                speechOutput = speechOutput + this.t("DOWN_MSG");
            break;
        }
        speechOutput = speechOutput + this.t("REPROMPT");
        this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },

    'SetMode': function() {
        var item = this.event.request.intent.slots.mode.value;
        var speechOutput = item + this.t("NOT_IMPLEMENTED");
        switch(item)
        {
            case 'brief':
                speechOutput = this.t('BRIEF_MSG');
                break;
            case 'normal':
                speechOutput = this.t('NORMAL_MSG');
                break;
            case 'ludacris':
                speechOutput = this.t('LUDACRIS_MSG');
                break;           
        }
        speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
    'Version': function() {
         // Create speech output
        var speechOutput = this.t("VERSION_MSG");
        speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
     'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MSG"));
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MSG');
        const reprompt = this.t('HELP_MSG');
        this.emit(':ask', speechOutput, reprompt);
    },
     'AMAZON.NoIntent': function () {
         var speechOutput = this.t('NO_MSG');
         speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
     'AMAZON.PauseIntent': function () {
         var speechOutput = this.t('PAUSE_MSG');
         speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
     'AMAZON.ResumeIntent': function () {
         var speechOutput = this.t('RESUME_MSG');
         speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
    'AMAZON.StartIntent': function () {
        this.emit(':tell', this.t("GET_START_MSG"));
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = this.t('STOP_MSG');
        this.emit(':tell', speechOutput, '');
    },
     'AMAZON.YesIntent': function () {
         var speechOutput = this.t('YES_MSG');
         speechOutput = speechOutput + this.t("REPROMPT");
         this.emit(':ask', speechOutput, this.t("REPROMPT"));
    },
    'SessionEndedRequest': function () {
         var speechOutput = this.t('STOP_MSG');
         this.emit(':tell', speechOutput, '');
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
