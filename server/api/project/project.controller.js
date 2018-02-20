'use strict';

var _ = require('lodash');
var Project = require('./project.model');

/* PAGINATION */
require('mongoose-query-paginate');
var moment = require('moment')
var async = require('async')
// Get list of Project
var getAllData_Pagination = function(req, cb) {
  var filter = {};
  var options = {
    perPage: req.query.length,// Number of items to display on each page.
    delta  : 5,     // Number of page numbers to display before and after the current one.
    page   : (req.query.start / req.query.length)+1  // Initial page number.
  };
  Project
    .find(filter)
    .sort({_id : -1})
    .paginate(options,function (err, doc) {
      if(err) { cb(err,doc);  }
      return cb(err,{messages:{},draw:req.query.draw,recordsTotal:doc.count,recordsFiltered:doc.count,data:doc.results});
  });
};

// Get list of Projects
exports.index = function(req, res) {
  getAllData_Pagination(req,function(err,doc){
    if(err) { 
      return handleError(res, err); 
    }else{
      return res.status(200).json(doc);
    }

  })
};

// Get a single Project
exports.show = function(req, res) {
  Project.findById(req.params.id, function (err, doc) {
    if(err) { return handleError(res, err); }
    if(!doc) { return res.status(404).send('Not Found'); }
    return res.json(doc);
  });
};

// Creates a new Project in the DB.
exports.create = function(req, res) {
  Project.create(req.body, function(err, doc) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(doc);
  });
};

// Updates an existing Project in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, doc) {
    if (err) { return handleError(res, err); }
    if(!doc) { return res.status(404).send('Not Found'); }
    var updated = _.merge(doc, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(doc);
    });
  });
};

// Deletes a Project from the DB.
exports.destroy = function(req, res) {
  Project.findById(req.params.id, function (err, doc) {
    if(err) { return handleError(res, err); }
    if(!doc) { return res.status(404).send('Not Found'); }
    doc.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};
function handleError(res, err) {
  return res.status(500).send(err);
}