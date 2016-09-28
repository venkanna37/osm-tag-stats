'use strict';

var fs = require('fs');
var ff = require('feature-filter');
var featureCollection = require('turf-featurecollection');

module.exports = function (data, tile, writeData, done) {

    var filter = (mapOptions.tagFilter) ? ff(mapOptions.tagFilter) : false;
    var layer = data.osm.osm;
    var osmID = (mapOptions.count) ? [] : null;
    var dates = Boolean(mapOptions.dates) ? parseDates(mapOptions.dates) : false;
    var users = mapOptions.users;
    var keys = {};
    var values = {};
    layer.features.forEach(function (feature) {
        Object.keys(feature.properties).forEach(function(property) {
            if (property.indexOf('@') === -1) {
                if (!(property in keys)) {
                   keys[property] = 1;
                } else {
                   keys[property] += 1;
                }
                if (!(feature.properties[property] in values)) {
                   values[feature.properties[property]] = 1;
                } else {
                   values[feature.properties[property]] += 1;
                }
            }
        });
    });
    done(null, {"keys": keys, "values": values});
};

function parseDates(dates) {
    var startDate = new Date(dates[0]);
    var endDate = new Date(dates[dates.length - 1]);
    if (dates.length === 1) {
        endDate.setDate((endDate.getDate() + 1));
    }
    //_timestamp in QA tiles is in seconds and not milliseconds
    return [(startDate.getTime() / 1000), (endDate.getTime() / 1000)];
}
