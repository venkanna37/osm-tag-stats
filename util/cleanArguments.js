'use strict';

var path = require('path');
var fs = require('fs');

/**
 @typedef Argument
 @type {object}
 @property {string} mbtiles - path to mbtiles file
 @property {string} users - CSV list of usernames
 @property {string} filter - path to file containing tag filters
 @property {string} dates - CSV UTC format start end dates
 @property {string} geojson - path to write geojson
 */

/**
 @typedef cleanArgument
 @type {object}
 @property {Argument} argv - validated and cleaned up input arguments
 @property {string} tmpGeojson - absolute path of geojson file
 */

/**
 @function cleanArguments
 @description Cleans the arguments, which are to be processed in tile-reduce script
 @param {Argument} argv
 @param {string} tmpFilesDir
 @return {cleanArgument}
 */
function cleanArguments(argv, tmpFilesDir) {
    if (argv.removeProperties) {
        argv.removeProperties = argv.removeProperties.split(',');
        argv.removeProperties = trimStrings(argv.removeProperties);
    }

    //filter
    if (argv.filter && fs.existsSync(argv.filter)) {
        argv.filter = JSON.parse(fs.readFileSync(argv.filter));
    } else {
        argv.filter = false;
    }

    //path
    if (!argv.mbtiles || (path.extname(argv.mbtiles) !== '.mbtiles')) {
        argv.mbtiles = false;
    } else {
        argv.mbtiles = path.normalize(argv.mbtiles);
        if (!fs.existsSync(argv.mbtiles)) {
            argv.mbtiles = false;
        }
    }
    return {'argv': argv};
}

/**
 @function trimStrings
 @description trim the extra spaces from the strings
 @param {string[]} strings
 @return {string[]}
 */
function trimStrings(strings) {
    return strings.map(function (s) {
        return s.trim();
    });
}

/**
 * Cleans the arguments passed to main file.
 * @module util/cleanArguments
 * @type {cleanArgument}
 */
module.exports = cleanArguments;
