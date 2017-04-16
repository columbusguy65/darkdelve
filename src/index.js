
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports one lauguages. (en-US).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs
 **/

'use strict';
var rooms = require("./quest2");
var currentRoom;
var roomIndex = 0;
var numLinks = 0;
var eastLink, westLink, northLink, southLink, upLink, downLink;
var me;
InitializeExits();

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.f502aa7c-92e5-4a93-ad0c-677dd44c34ad';

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
            ABOUT_MSG: 'This wonderful work of fiction is brought to you by, zero cat order. Programmed by Bill Nadvornik. Content by Martin Bosso.',
            BRIEF_MSG: 'This mode will tell you a condensed version of everything. Good if you drank too much coffee.',
            EXIT_ONE: 'There is one exit to the ',
            EXIT_MULTI: 'There are exits to the ',
            EXIT_NONE: 'There are no exits to this room. Sorry. ',
            EQUIP_MSG: 'You equipped item ',
            HEAL_MSG: 'You attempt to heal yourself and are successful. ',
            HELP_MSG: "No help for you! ",
            HELP_REPROMPT: 'What can I help you with? ',
            MOVE_MSG: 'You gather your energy and move ',
            NO_EXIT_MSG: 'There is no exit in that location. ',
            NO_MSG: 'You said no. ',
            NORMAL_MSG: 'This mode will tell you a decent amount of detail without the numbers. ',
            NOT_IMPLEMENTED: ' has not been implemented. ',
            PAUSE_MSG: 'I will pause the game for you. Say resume to continue. ',
            PIT_MSG: 'You fell in a spiked pit!! Your lifeless, and highly punctured corspse is never found. The End!',
            RESUME_MSG: 'Resuming your adventure.  ',
            REPROMPT: ' What would you like to do now? ',
            SKILL_NAME: "dark delve",
            SLEEP_MSG: 'I would not try to sleep in here, with all the monsters wandering around. ',
            START_MSG: "Welcome to Dark Delve. You can say begin adventure. ",
            STOP_MSG: 'Only cowards are afraid of the dark! Goodbye! ',
            LUDACRIS_MSG: 'This mode will give you all the rolls and modifiers. ',
            VERSION_MSG: 'This is an on going project which will have many versions. The current version is one dot zero. ',
            YES_MSG: 'You said yes. ', 
            COMMANDS: 'ATTACK, BRIEF, CLOSE, DEFEND, DESCRIBE, DROP,' +
            'EQUIP, EXAMINE, GET, GO, HEAL, HIT, LISTEN, LOOK, LUDACRIS, MOVE, NORMAL, OPEN, READ, REPEAT, RUN,'+
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
    'AboutIntent': function () {
        this.emit('About'); 
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
    'About': function() {
        // Create speech output
        var speechOutput = this.t('ABOUT_MSG');
         var reprompt = this.t('REPROMPT');
         this.emit(':ask', speechOutput, reprompt);
    },
    'Begin': function (){
        me = this;
        parseRoom(0);
        speakRoom();
        
    },

     'Command': function() { //   heal, repeat, sleep
        var item = this.event.request.intent.slots.word.value;
         // Create speech output
       // var speechOutput = item + this.t("NOT_IMPLEMENTED");
       var speechOutput;
       switch (item)
            {
            case 'heal':
                speechOutput = this.t("HEAL_MSG");
            break;
            case 'repeat':
                //speechOutput = this.t("SLEEP_MSG");
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
        me = this;
        var direction = this.event.request.intent.slots.direction.value;
         // Create speech output
        var speechOutput = this.t("MOVE_MSG");
       // westLink = 3;
        //eastLink = 2;
        switch(direction)
        {
            case 'west':
                if (westLink != 0) {
                speechOutput = speechOutput + this.t("WEST_MSG");
                parseRoom(westLink -1);
                speakRoom();
                }else{
                speechOutput = this.t("NO_EXIT_MSG");
                };
                break;
            case 'east':
                if (eastLink != 0) {
                speechOutput = speechOutput + this.t("EAST_MSG");
                 parseRoom(eastLink -1);
                 speakRoom();
                 }else{
                speechOutput = this.t("NO_EXIT_MSG");
                };
                break;
            case 'north':
                if (northLink != 0) {
                speechOutput = speechOutput + this.t("NORTH_MSG");
                 parseRoom(northLink -1);
                 speakRoom();
                 }else{
                speechOutput = this.t("NO_EXIT_MSG");
                };
                break;
            case 'south':
                if (southLink != 0) {
                    speechOutput = speechOutput + this.t("SOUTH_MSG");
                     parseRoom(southLink-1);
                     speakRoom();
                 }else{
                speechOutput = this.t("NO_EXIT_MSG");
                };
                break;
            case 'up':
                if (upLink != 0) {
                    speechOutput = speechOutput + this.t("UP_MSG");
                     parseRoom(upLink-1);
                     speakRoom();
                 }else{
                speechOutput =  this.t("NO_EXIT_MSG");
                };
                break;
            case 'down':
                if (downLink != 0) {
                    speechOutput = speechOutput + this.t("DOWN_MSG");
                     parseRoom(upLink-1);
                     speakRoom();
                }else{
                    speechOutput =  this.t("NO_EXIT_MSG");
                };
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

function InitializeExits(){
    eastLink=0;
    westLink=0;
    northLink=0;
    southLink=0;
    upLink=0;
    downLink=0;
};

function speakRoom(roomIndex)
{
    //me.emit(':ask', roomIndex, "");
    var speechOutput = currentRoom.desc + " ";
     
        if (numLinks == 0){
            speechOutput = speechOutput + me.t('EXIT_NONE')
        };
        
        if (numLinks == 1) {
                speechOutput = speechOutput + me.t('EXIT_ONE') + currentRoom.links.link[0]['__text']
            }
         else
         {  
             speechOutput = speechOutput + me.t('EXIT_MULTI') 
             for (var i = 0; i < numLinks; i++) {
                speechOutput = speechOutput + currentRoom.links.link[i]['__text']
                if (i != numLinks -1)
                {
                   speechOutput = speechOutput + ", and "
                 };
            };
         };
        speechOutput = speechOutput + ". " + me.t("REPROMPT");
         me.emit(':ask', speechOutput, me.t("REPROMPT"));
};

function parseRoom(roomIndex) {
    InitializeExits();
    currentRoom = rooms.quest.page[roomIndex];
    numLinks = currentRoom.links.link.length;
    
    for (var i = 0; i < numLinks; i++) 
    {
        switch (currentRoom.links.link[i]['__text'])
        {
        case 'East':
            eastLink= currentRoom.links.link[i]['_id'];
            break;
        case 'West':
            westLink= currentRoom.links.link[i]['_id'];
            break;
        case 'North':
            northLink= currentRoom.links.link[i]['_id'];
            break;
        case 'South':
            southLink= currentRoom.links.link[i]['_id'];
            break; 
        case 'Up':
            upLink= currentRoom.links.link[i]['_id'];
            break;
        case 'Down':
            downLink= currentRoom.links.link[i]['_id'];
            break;         
        };
    };
};
