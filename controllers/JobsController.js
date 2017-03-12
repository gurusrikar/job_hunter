/**
 * Created by gurusrikar on 3/10/17.
 */

var mongoose = require('mongoose');
var Job = require('../models/Jobs-schema');
var https = require('https');
var request = require('request');
var jobsApiUrl = "jobs.github.com";

var setupProfile = function (req, res, next, user) {
    var newUser = new Job(user);
    newUser.createNewProfile(function (err, newUser) {
        if (err || newUser.errors !== undefined) {
            console.log(err);
            return res.json({error: "failed"});
        }
        return res.json({success: true});
    });
};

var addSkills = function (req, res, next, skills) {
    var name = req.query.name;
    Job.findByName(name, function (err, user) {
        if (err) {
            return res.json({success: false, error: err});
        } else {
            console.log(user.name);
            skills.forEach(function (skill) {
                user.skills.push(skill);
            });
            console.log(user);
            user.updateMyProfile(function (err, user) {
                console.log(user);
                return res.json({success: true});
            });
        }
    })
};

var addRoles = function (req, res, next, roles) {
    var name = req.query.name;
    Job.findByName(name, function (err, user) {
        if (err) {
            return res.json({success: false, error: err});
        } else {
            console.log(user.name);
            roles.forEach(function (role) {
                user.roles.push(role);
            });
            user.updateMyProfile(function (err, user) {
                console.log(user);
                return res.json({success: true});
            });
        }
    })
};

var addCompanies = function (req, res, next, companies) {
    var name = req.query.name;
    Job.findByName(name, function (err, user) {
        if (err) {
            return res.json({success: false, error: err});
        } else {
            companies.forEach(function (company) {
                user.companies.push(company);
            });
            user.updateMyProfile(function (err, user) {
                console.log(user);
                return res.json({success: true});
            });
        }
    });
};

var listMyJobs = function (req, res, next) {
    var name = req.query.name;
    var skill = req.query.skill;
    var location = req.query.location;

    Job.findByName(name, function (err, user) {

        var find = " ";
        var reg = new RegExp(find, 'g');
        location.replace(reg, "+");

        var link = 'https://jobs.github.com/positions.json?';
        console.log(skill);
        console.log(location);
        if (skill != 'any') {
            link = link + 'description=' + skill + '&';
        }
        if (location != 'any') {
            link = link + 'location=' + location + '&';
        }

        link = link.substring(0, link.length - 1);
        console.log(link);

        request(link, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(error);
                return res.json({success: false, error: error});
            } else {
                var results = JSON.parse(body);
                if (results.length >= 5) {
                    results = results.slice(0, 5);
                }
                var finalResults = results.map(function(job) {
                    return {
                        title: job.title,
                        location: job.location,
                        company: job.company
                    };
                });
                return res.json(finalResults);
            }
        });

    });
};

var userExists = function (req, res, next) {
    var name = req.query.name;
    Job.findByName(name, function (err, user) {
        if (err || user == undefined) {
            return res.json({answer: false});
        } else {
            return res.json({answer: true});
        }
    });

};

var saveJobs = function (req, res, next) {
    var name = req.query.name;
    var data = req.query.data;
    Job.findByName(name, function (err, user) {
        if (err || user == undefined) {
            return res.json({ok: false});
        } else {
            user.jobs = JSON.parse(data);
            user.updateMyProfile(function (err, user) {
                console.log(user);
                return res.json({ok: true});
            });
        }
    });

};


module.exports = {
    setupProfile: setupProfile,
    addSkills: addSkills,
    addCompanies: addCompanies,
    addRoles: addRoles,
    listMyJobs: listMyJobs,
    userExists: userExists,
    saveJobs: saveJobs
};