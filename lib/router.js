var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var glob = require('glob');
var express = require('express');

var defaults = {
  routesConfigSource: '/routes.json',
  controllersPath: '/controllers'
};

var parseFile = function(fileName) {
  var fileContent = null;
  var configObj = null;

  try {
    var stat = fs.statSync(fileName);
    if (!stat && stat.size < 1) {
      return null;
    }
  }
  catch (e1) {
    return null;
  }

  try {
    fileContent = fs.readFileSync(fileName, 'utf-8');
  }
  catch (e2) {
    throw new Error('Routes config file ' + fileName + ' cannot be read.');
  }

  try {
    configObj = JSON.parse(fileContent);
  }
  catch (e3) {
    throw new Error('Routes config file ' + fileName + ' cannot be parsed.'); 
  }

  return configObj;
};

exports.registerRoutes = function(opts) {
  var router = express.Router();

  opts = _.assign(defaults, opts);

  //load routes config
  var routesConfigFile = path.join(process.cwd(), opts.routesConfigSource);
  var routes = parseFile(routesConfigFile);

  if (!routes) {
    throw new Error('Cannot find ' + opts.routesConfigFile + ' file.');
  }

  var controllerFiles = glob.sync(path.join(process.cwd(), opts.controllersPath, '/**/*.js'));
  var controllers = {};

  //load controllers
  _.forEach(controllerFiles, function(controllerFile) {
    var controllerPath = controllerFile.replace(/\.[^.]*$/, '');
    controllers[path.basename(controllerPath)] = controllerFile;
  });

  _.forOwn(routes, function(pathObj, path) {
    mapPathMethod(pathObj, path);
  });

  function mapPathMethod(pathObj, path) {
    _.forOwn(pathObj, function(methodObj, method) {
      var controller = require(controllers[methodObj.controller]);

      router[method](path, function(req, res, next) {
        controller[methodObj.action](req, res, next);
      });
    });
  }

  return router;
};