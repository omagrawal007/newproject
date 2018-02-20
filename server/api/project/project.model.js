'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	Project_Code :{type: String, required: true },
	Project_Name :{type: String, required: true },
	Start_Date :{type: Date, required: true },
	Expected_End_date :{type: Date, required: true },
	Actual_End_Date : { type: Date, required: false},
	Expected_Effort : {type:Number ,required:true }, // In Hrs
	Project_Status  : { type: String,Enum:['Active','WIP','On-Hold','Complete'], required: false }, 
	Crerated_By  : { type: String,required: false }, 
	Updated_By  : { type: String,required: false },
	Team_Member  :[{ type: Schema.Types.ObjectId, ref: 'Users' }],
	// Consultant_Id  :{ type: Schema.Types.ObjectId, ref: 'Story' }, 
},
{ 
    collection : "Projects" ,timestamp:true
});

module.exports = mongoose.model('Projects', ProjectSchema);