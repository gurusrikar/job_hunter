/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports en-US lauguage.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-trivia
 **/

'use strict';

const Alexa = require('alexa-sdk');
const questions = require('./question');
var http = require('http');

const GAME_NAME = 'Reindeer Trivia'; // TODO Be sure to change this for your skill.
const ANSWER_COUNT = 4; // The number of possible answers per trivia question.
const GAME_LENGTH = 5;  // The number of questions per trivia game.
const GAME_STATES = {
    TRIVIA: '_TRIVIAMODE', // Asking trivia questions.
    START: '_STARTMODE', // Entry point, start the game.
    HELP: '_HELPMODE', // The user is asking for help.
};

const APP_STATES = {
    START: '_PROFILEMODE'
    // SEARCH: '_SEARCHMODE'
};

var profileUrl = 'http://ec2-35-163-34-220.us-west-2.compute.amazonaws.com:5003/jobs/setup';
var jobSearchUrl = 'http://ec2-35-163-34-220.us-west-2.compute.amazonaws.com:5003/jobs/jobs';
var personSavedUrl = 'http://ec2-35-163-34-220.us-west-2.compute.amazonaws.com:5003/jobs/user-exists'
var jobSaveUrl = 'http://ec2-35-163-34-220.us-west-2.compute.amazonaws.com:5003/jobs/savejobs'

const PROFILE_QUESTIONS = [
    "What is your name?",
    "What is your highest level of education?",
    "How much professional work experience do you have?",
    "What skills are you good at?"
];

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL)

function populateGameQuestions() {
    return undefined;
}

/**
 * Get the answers for a given question, and place the correct answer at the spot marked by the
 * correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
 * only ANSWER_COUNT will be selected.
 * */
function populateRoundAnswers(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation) {
    return undefined;
}

function isAnswerSlotValid(intent) {
    return undefined;
}

function handleUserGuess(userGaveUp) {
    return undefined;
}

const newSessionHandlers = {
    /**
     * Entry point. Start a new game on new session. Handle any setup logic here.
     */
    'NewSession': function () {
        this.handler.state = GAME_STATES.START;
        if (this.event.request.type === 'LaunchRequest') {
            this.emitWithState('StartJobsManager', true);
        } else if (this.event.request.type === 'IntentRequest') {
            console.log(`current intent: ${this.event.request.intent.name
                }, current state:${this.handler.state}`);
            const intent = this.event.request.intent.name;
            this.emitWithState(intent);
        }
    },

    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
};

const createStateHandler = Alexa.CreateStateHandler;

const startStateHandlers = createStateHandler(GAME_STATES.START, {
    'StartJobsManager': function (newProfile) {
        let speechOutput = 'Welcome to Job Hunter! Let us setup your profile. ';
        const profileQuestions = PROFILE_QUESTIONS;
        const currentQuestionIndex = 0;
        const spokenQuestion = profileQuestions[currentQuestionIndex];
        let repromptText = `${spokenQuestion}`;

        speechOutput += repromptText;
        
        Object.assign(this.attributes, {
            speechOutput: repromptText,
            repromptText,
            currentQuestionIndex,
            questions: profileQuestions
        });

        this.handler.state = APP_STATES.START;
        this.emit(':ask', speechOutput, repromptText);
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState('helpTheUser', true);
    },
    'Unhandled': function () {
        this.emit('StartGame', true);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },
});

const setupProfileHandlers = createStateHandler(APP_STATES.START, {
    'JobManagerSetup': function () {
        
        let currentQuestionIndex = parseInt(this.attributes.currentQuestionIndex, 10);
        let speechOutput = '';
        let personName = this.attributes.personName;
        let education = '';
        let experience = '';
        let skills = '';
        let repromptText = '';
        if (currentQuestionIndex == 0) {
            
            personName = this.event.request.intent.slots.personName.value;

            // Check if the person exists
            var link = personSavedUrl + '?' + 'name=' + personName;
            var selfy = this;
            http.get( link, function( response ) {
                let body = '';
                response.on( 'data', function( data ) {
                    body = body + data;
                });
                
                response.on( 'end', function() {
                    selfy.handler.state = APP_STATES.START;
                    console.log(body);
                    let result = JSON.parse(body);
                    if (result.answer == true) {
                        // Person exists
                        speechOutput = `Welcome back ${personName}. `;
                        repromptText = 'You can ask me to lookup jobs by location or by skills. For example, ask me to find jobs in San Franscisco.';
                        speechOutput = speechOutput + repromptText;
                        Object.assign(selfy.attributes, {
                            speechOutput: speechOutput,
                            repromptText: repromptText,
                            personName: personName
                        });
                        selfy.emit(':ask', speechOutput, repromptText);
                    } else {
                        // Person does not exist
                        speechOutput = `Hi ${personName}, `;
                        currentQuestionIndex = currentQuestionIndex + 1;
                        repromptText = PROFILE_QUESTIONS[currentQuestionIndex];
                        speechOutput = speechOutput + repromptText;
                        selfy.handler.state = APP_STATES.START;

                        Object.assign(selfy.attributes, {
                            speechOutput: speechOutput,
                            repromptText: repromptText,
                            currentQuestionIndex,
                            questions: PROFILE_QUESTIONS,
                            personName: personName,
                            education: education,
                            experience: experience,
                            skills: skills
                        });

                        
                        selfy.emit(':ask', speechOutput, repromptText, personName);
                    }

                });

                response.on('err', function (err){
                    console.log(err);
                })
            });

        } else if (currentQuestionIndex == 1) {
            
            education = this.event.request.intent.slots.education.value;
            speechOutput = '';
            currentQuestionIndex = currentQuestionIndex + 1;
            repromptText = PROFILE_QUESTIONS[currentQuestionIndex];
            speechOutput = speechOutput + repromptText;
            this.handler.state = APP_STATES.START;

            Object.assign(this.attributes, {
                speechOutput: speechOutput,
                repromptText: repromptText,
                currentQuestionIndex,
                questions: PROFILE_QUESTIONS,
                personName: personName,
                education: education,
                experience: experience,
                skills: skills
            });

            
            this.emit(':ask', speechOutput, repromptText, personName);

        } else if (currentQuestionIndex == 2) {
            
            let experience = this.event.request.intent.slots.experienceInMonths.value;
            let name = this.attributes.personName;
            let education = this.attributes.education;

            // make the request
            var query = 'name=' + encodeURIComponent(name) + '&education=' + encodeURIComponent(education) + '&experience=' + encodeURIComponent(experience);
            var link = profileUrl + '?' + query;
            console.log(link);
            var selfy = this;
            http.get( link, function( response ) {

                response.on( 'data', function( data ) {
                    selfy.handler.state = APP_STATES.START;
                    currentQuestionIndex = currentQuestionIndex + 1;
                    repromptText = PROFILE_QUESTIONS[currentQuestionIndex];
                    speechOutput = speechOutput + repromptText;

                    Object.assign(selfy.attributes, {
                        speechOutput: speechOutput,
                        repromptText: repromptText,
                        currentQuestionIndex,
                        questions: PROFILE_QUESTIONS,
                        personName: personName,
                        education: education,
                        experience: experience,
                        skills: skills
                    });                
                    selfy.emit(':ask', speechOutput, repromptText, personName);

                });
            });

        } else if (currentQuestionIndex == 3) {

            skills = this.event.request.intent.slots.addskill.value;
            currentQuestionIndex = currentQuestionIndex + 1;

            speechOutput = `I have saved your profile. `;
            speechOutput += `You can ask me to lookup jobs by location or by skills. For example, ask me to find jobs in San Francisco.`;
            repromptText = speechOutput;
            this.handler.state = APP_STATES.START;
            Object.assign(this.attributes, {
                speechOutput: speechOutput,
                repromptText: repromptText,
                currentQuestionIndex,
                questions: PROFILE_QUESTIONS,
                personName: personName,
                education: education,
                experience: experience,
                skills: skills
            });
            
            this.emit(':ask', speechOutput, repromptText, personName);
        }
        
    },

    'JobManagerSearch': function() {
        let location = this.event.request.intent.slots.location.value || 'any';
        let skill = this.event.request.intent.slots.skill.value || 'any';
        let name = this.attributes.personName || 'John';

        // make the request
        var query = 'name=' + encodeURIComponent(name) + '&location=' + encodeURIComponent(location) + '&skill=' + encodeURIComponent(skill);
        // var query = 'name=' + name + '&location=' + location + '&skill=' + skill;
        var link = jobSearchUrl + '?' + query;
        console.log(link);
        var selfy = this;
        let speechOutput = '';
        let repromptText = '';
        http.get( link, function( response ) {

            let body = '';
            response.on( 'data', function( data ) {
                body = body + data;
                console.log(body);
            });

            response.on( 'end', function() {
                selfy.handler.state = APP_STATES.START;
                console.log(body);
                let jobs = JSON.parse(body);
                console.log(jobs);
                let total = jobs.length;
                let context = location == 'any' ? (skill == 'any' ? '.' : `which require ${skill}`) : `at ${location}`;
                speechOutput = `I found ${total} positions ${context}. `;
                jobs.forEach(function (job) {
                    repromptText += `${job.title} position at ${job.company}. `;
                });

                repromptText += 'Would you like to save these?';
                speechOutput = speechOutput + repromptText;

                Object.assign(selfy.attributes, {
                    speechOutput: speechOutput,
                    repromptText: repromptText,
                    personName: name,
                    state: 'jobsListed',
                    jobs: jobs
                });
                selfy.emit(':ask', speechOutput, repromptText, total);

            });

            response.on('err', function (err) {
                console.log(err);
            })
        });

    },
    'AMAZON.YesIntent': function () {
        const speechOutput = 'Ok! Saved to your profile. I could email them to you in the near future!';
        var jobs = this.attributes.jobs;
        var link = jobSaveUrl + '?' + 'name=' + this.attributes.personName + '&data=' + JSON.stringify(jobs);
        var selfy = this;
        http.get( link, function( response ) {

            let body = '';
            response.on( 'data', function( data ) {
                body = body + data;
                console.log(body);
            });

            response.on( 'end', function() {
                selfy.emit(':tell', speechOutput);
            });

            response.on('err', function (err) {
                console.log(err);
                selfy.emit(':tell', speechOutput);
            })
        });
    },
    'AMAZON.NoIntent': function () {
        const speechOutput = 'Ok, Goodbye!';
        this.emit(':tell', speechOutput);
    },
});

// const searchJobsHandlers = createStateHandler(APP_STATES.START, {
//     'JobManagerSearch': function() {
//         let location = this.event.request.intent.slots.location.value || undefined;
//         let skill = this.event.request.intent.slots.skill.value || undefined;
//         let name = this.attributes.personName || 'John';

//         // make the request
//         var query = 'name=' + encodeURIComponent(name) + '&location=' + encodeURIComponent(location) + '&skill=' + encodeURIComponent(skill);
//         var link = jobSearchUrl + '?' + query;
//         console.log(link);
//         var selfy = this;
//         let speechOutput = '';
//         let repromptText = '';
//         http.get( link, function( response ) {

//             response.on( 'data', function( data ) {
//                 selfy.handler.state = APP_STATES.START;
//                 let jobs = JSON.parse(data);
//                 console.log(jobs);
//                 let total = jobs.length;
//                 repromptText = `I found ${total} positions`;
//                 speechOutput = speechOutput + repromptText;

//                 Object.assign(selfy.attributes, {
//                     speechOutput: speechOutput,
//                     repromptText: repromptText,
//                     personName: name
//                 });                
//                 selfy.emit(':ask', speechOutput, repromptText, total);

//             });
//         });

//     }
// });


const triviaStateHandlers = createStateHandler(GAME_STATES.TRIVIA, {
    'AnswerIntent': function () {
        handleUserGuess.call(this, false);
    },
    'DontKnowIntent': function () {
        handleUserGuess.call(this, true);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptText);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        const speechOutput = 'Would you like to keep playing?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Ok, let\'s play again soon.');
    },
    'Unhandled': function () {
        const speechOutput = `Try saying a number between 1 and ${ANSWER_COUNT.toString()}`;
        this.emit(':ask', speechOutput, speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },

    'JobManagerSetup': function () {
        this.emit(':ask', "In trivia state handler");
    },
});

const helpStateHandlers = createStateHandler(GAME_STATES.HELP, {
    'helpTheUser': function (newGame) {
        const askMessage = newGame ? 'Would you like to start playing?' : 'To repeat the last question, say, repeat. Would you like to keep playing?';
        const speechOutput = `I will ask you ${GAME_LENGTH} multiple choice questions. Respond with the number of the answer. `
            + `For example, say one, two, three, or four. To start a new game at any time, say, start game. ${askMessage}`;
        const repromptText = `To give an answer to a question, respond with the number of the answer . ${askMessage}`;

        this.emit(':ask', speechOutput, repromptText);
    },
    'StartGame': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emitWithState('helpTheUser');
    },
    'AMAZON.HelpIntent': function () {
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.YesIntent': function () {
        if (this.attributes.speechOutput && this.attributes.repromptText) {
            this.handler.state = GAME_STATES.TRIVIA;
            this.emitWithState('AMAZON.RepeatIntent');
        } else {
            this.handler.state = GAME_STATES.START;
            this.emitWithState('StartGame', false);
        }
    },
    'AMAZON.NoIntent': function () {
        const speechOutput = 'Ok, we\'ll play another time. Goodbye!';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        const speechOutput = 'Would you like to keep playing?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = GAME_STATES.TRIVIA;
        this.emitWithState('AMAZON.RepeatIntent');
    },
    'Unhandled': function () {
        const speechOutput = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'SessionEndedRequest': function () {
        const speechOutput = 'OK, Goodbye!';
        this.emit(':tell', speechOutput);
    },

    'JobManagerSetup': function () {
        this.emit(':ask', "In help state handler");
    },
});

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers, setupProfileHandlers);
    alexa.APP_ID = APP_ID;
    alexa.execute();
};
