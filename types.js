var graphql = require('graphql');
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLList = graphql.GraphQLList;
var under = require('underscore');
var db = require('./database');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GOOGLE_API_KEY = "AIzaSyAahonfOsE-ZyvVgNbjJ67ja3dhN7UFA4Y";
var Request = require('request');
var rp = require('request-promise');
var parallel = require('node-parallel');
var parse = require('xml-parser');
var inspect = require('util').inspect;
var cheerio = require('cheerio')


var poiType = new GraphQLObjectType({
    name: "POI",
    description: "Punto di interesse",
    fields: {
        name: {
            type: GraphQLString,
            description: "Nome del punto"
        },
        icon: {
            type: GraphQLString,
            description: "url icona"
        },
        types: {
            type: GraphQLString,
            description: "tipo di punto"
        },
        rating: {
            type: GraphQLString,
            description: "tipo di punto"
        },

    }
});



var meteoType = new GraphQLObjectType({
    name: "Meteo",
    description: "Tempo",
    fields: {
        tempo: {
            type: GraphQLString,
            description: "Nome dell'utente"
        },
        temp: {
            type: GraphQLString,
            description: "Username dell'utente"
        },
        servizio: {
            type: GraphQLString,
            description: "Username dell'utente"
        }

    }
});



var cittaType = new GraphQLObjectType({
    name: "Citta",
    description: "descrizione della citta",
    fields: {
        name: {
            type: GraphQLString,
            description: "Nome città",
            resolve:function(_,args) {
                return _.name;
            }
        },
        meteo: {
            type: new GraphQLList(meteoType),
            description: "Oggetto meteo",
            resolve:function(_,args) {
                var obj = [];
                var ret = [];
                var lock = false;
                return new Promise(function(resolve, reject) {
                    parallel().add(function(done) {
                        return getInfoCity(_.name).then(function(loc) {
                            rp("https://api.forecast.io/forecast/65329798e5148bb200a26f1e7959bb13/"+loc.lat+","+loc.lng)
                                .then((data) => {

                                    var result = JSON.parse(data);
                                    obj.push({
                                        "servizio":"Forecast",
                                        "tempo": result.currently.summary,
                                        "temp" : result.currently.temperature,
                                        "name" : _.name
                                    });
                                    //return obj;
                                });
                        });

                    }).add(function(done) {
                        return getInfoCity(_.name).then(function(loc) {
                            rp("http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=stations&requestType=retrieve&format=xml&radialDistance=50;" + loc.lng + "," + loc.lat)
                                .then((data) => {
                                    var object = parse(data);
                                    var aeroporti;
                                    for(var i = 0; i<object.root.children.length; i++){
                                        if(object.root.children[i].name == "data") {
                                            aeroporti = (object.root.children[i].children);
                                            break;
                                        }
                                    }
                                    var aid;
                                    for(var i = 0; i<aeroporti.length; i++ ) {
                                        for (var j = 0; j < aeroporti[i].children.length; j++) {
                                            if(aeroporti[i].children[j].name == "station_id") {
                                                aid =     aeroporti[i].children[j].content;
                                            }
                                        }

                                        if(aid == "") continue;
                                        rp("http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString="+aid+"&hoursBeforeNow=3&MostRecent=true")
                                            .then((data) => {

                                                var $ = cheerio.load(data);
                                                var temperatura = ($("temp_c").text());
                                                var stazione = ($("station_id").text());
                                                if(stazione == "" || temperatura == "") return;
                                                obj.push({
                                                    "servizio": "Aeroporto " + stazione,
                                                    "temp" : temperatura
                                                });
                                                //return obj;
                                            });
                                    }
                                    //return obj;
                                });
                        });
                    }).done(function(err, results) {
                        console.log(obj);
                        lock = true;
                        resolve(obj);
                    })

                }).then(() =>{
                    return obj;
                });
            }
        },
        puntiInteresse: {
            type: new GraphQLList(poiType),
            description: "Username dell'utente",
            args: {
                limit: {
                    type: GraphQLInt
                }
            },
            resolve:function(_,args) {
                var limit = args.limit || -1;
                return getInfoCity(_.name).then(function(loc) {
                    return rp("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+loc.lat + "," + loc.lng+"&types=point_of_interest&radius=500&key=" + GOOGLE_API_KEY)
                        .then((data) => {
                            var result = JSON.parse(data);
                            var l = [];
                            for(var i = 0; i<result.results.length; i++) {
                                if(i>=limit && limit!=-1) { break };
                                var obj = {
                                    name: result.results[i].name,
                                    icon: result.results[i].icon,
                                    types: result.results[i].types,
                                    rating: result.results[i].rating
                                }
                                l[i] = obj;
                            }
                            return l;
                        });

                })

            }
        }
    }
});


var viewerType = new GraphQLObjectType({
    name: "Viewer",
    description: "Viewer",
    fields: {
        citta: {
            type: cittaType,
            description: "dati della citta",
            resolve: function (_, args) {
                return {"name": (args.name)};
            },
            args: {
                name: {
                    type: GraphQLString
                }
            }
        }
    }
});

function getInfoCity(City) {

    var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+City+"&types=geocode&key=" + GOOGLE_API_KEY;
    console.log(url);
    return rp(url).then((html) => {
        var resp = JSON.parse(html);
        return rp("https://maps.googleapis.com/maps/api/place/details/json?placeid="+resp.predictions[0].place_id+"&key=" + GOOGLE_API_KEY)
            .then((data) => {
                var d = JSON.parse(data);
                return (d.result.geometry.location);
            })
    });
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
exports.viewerType = viewerType;
exports.poiType = poiType;
exports.cittaType = cittaType;