'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	Task_Code :{type: String, required: true },
    Task_Name :{type: String, required: true },
    Task_Description :{type: String, required: true },
    Project_Reference_id: { type: Schema.Types.ObjectId, ref: 'Projects' },
	Start_Date :{type: Date, required: true },
	Expected_End_date :{type: Date, required: true },
	Actual_End_Date : { type: Date, required: false},
	Expected_Effort : {type:Number ,required:true }, // In Hrs
	Task_Status  : { type: String,Enum:['Active','WIP','On-Hold'], required: false }, 
	Crerated_By  : { type: String,required: false }, 
	Updated_By  : { type: String,required: false },
},
{ 
    collection : "Tasks" ,timestamp:true
});

module.exports = mongoose.model('Tasks', TaskSchema);