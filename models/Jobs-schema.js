/**
 * Created by gurusrikar on 3/10/17.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;

var schemaOptions = {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }};

var jobsSchema = new mongoose.Schema({
    name: String,
    education: String,
    experienceInMonths: String,
    skills: [String],
    roles: [String],
    companies: [String],
    interests: [String],
    jobs: [String]
}, schemaOptions);

jobsSchema.statics = {
    findByName: function (name, callback) {
        this.findOne({name: name}).
        exec(callback);
    },

    findByUserId: function (id, callback) {
        this.findById(id, callback);
    }
};

jobsSchema.methods.createNewProfile = function (callback) {
    return this.save(callback);
};

jobsSchema.methods.updateMyProfile = function (callback) {
    return this.save(callback);
};


var jobsModel = mongoose.model('jobs', jobsSchema);
module.exports = jobsModel;