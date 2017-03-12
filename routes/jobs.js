/**
 * Created by gurusrikar on 3/10/17.
 */

var express = require('express');
var router = express.Router();
var jobsController = require('../controllers/JobsController');

router.get('/setup', function (req, res, next) {
    var user = {
        name: req.query.name,
        education: req.query.education,
        experienceInMonths: req.query.experienceInMonths
    };

    jobsController.setupProfile(req, res, next, user);
});

router.get('/skills', function (req, res, next) {
    var skills = req.query.skill;
    jobsController.addSkills(req, res, next, skills);
});

router.get('/interested-roles', function (req, res, next) {
    var roles = req.query.role;
    jobsController.addRoles(req, res, next, roles);
});

router.get('/companies', function (req, res, next) {
    var companies = req.query.company;
    jobsController.addCompanies(req, res, next, companies);
});

router.get('/jobs', function (req, res, next) {
    jobsController.listMyJobs(req, res, next);
});

router.get('/user-exists', function (req, res, next) {
    jobsController.userExists(req, res, next);
});

router.get('/savejobs', function (req, res, next) {
    jobsController.saveJobs(req, res, next);
});


module.exports = router;