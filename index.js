#!/usr/bin/env node
'use strict';

var help = require('./util/help.js');
var tileReduce = require('tile-reduce');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var gsm = require('geojson-stream-merge');
var fs = require('fs');
var keys = {};
var values = {};
var tmpDir = 'tmp-osm-tag-stats/';
var cleanArguments = require('./util/cleanArguments')(argv, tmpDir);

var count = cleanArguments.argv.count,
    geojson = cleanArguments.argv.geojson,
    users = cleanArguments.argv.users,
    dates = cleanArguments.argv.dates,
    mbtilesPath = cleanArguments.argv.mbtiles,
    tmpGeojson = cleanArguments.tmpGeojson,
    tagFilter = cleanArguments.argv.filter,
    osmID = new Set(),
    tmpFd;

if ((!geojson && !count) || !mbtilesPath || argv.help) {
    help();
}

tileReduce({
    zoom: 12,
    map: path.join(__dirname, 'map.js'),
    sources: [{name: 'osm', mbtiles: mbtilesPath}],
    mapOptions: {
        'count': count,
        'tmpGeojson': tmpGeojson,
        'dates': dates,
        'users': users,
        'tagFilter': tagFilter
    }
})
.on('start', function () {
    if (tmpGeojson) {
        tmpFd = fs.openSync(tmpGeojson, 'w');
    }
})
.on('reduce', function (id) {
Object.keys(id.keys).forEach(function(key) {
    if (!(key in keys)) {
       keys[key] = id.keys[key];
    } else {
       keys[key] += id.keys[key];
    }
});
Object.keys(id.values).forEach(function(value) {
    if (!(value in values)) {
       values[value] = id.values[value];
    } else {
       values[value] += id.values[value];
    }
});
})
.on('end', function () {
    console.log('keys ', keys, ' values ', values);
});
