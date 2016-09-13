var graphql = require('graphql');
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLList = graphql.GraphQLList;
var under = require('underscore');
var db = require('./database');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GOOGLE_API_KEY = "AIzaSyAahonfOsE-ZyvVgNbjJ67ja3dhN7UFA4Y";
var Request = require('sync-request');


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
        }

    }
});



var cittaType = new GraphQLObjectType({
    name: "Citta",
    description: "descrizione della citta",
    fields: {
        meteo: {
            type: meteoType,
            description: "Oggetto meteo",
            resolve:function(_,args) {
                var loc = getInfoCity(_.name);
                var req_data = Request('GET', "https://api.forecast.io/forecast/65329798e5148bb200a26f1e7959bb13/"+loc.lat+","+loc.lng);
                var result = JSON.parse(req_data.getBody("utf8"));
                var obj = {
                    "tempo": result.currently.summary,
                    "temp" : result.currently.temperature,
                    "name" : _.name
                }
                return obj;
            }
        },
        puntiInteresse: {
            type: new GraphQLList(poiType),
            description: "Username dell'utente",
            resolve:function(_,args) {
                console.log(args);
                var loc = getInfoCity(_.name);
                var req_data = Request('GET', "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+loc.lat + "," + loc.lng+"&types=point_of_interest&radius=500&key=" + GOOGLE_API_KEY);
                var result = JSON.parse(req_data.getBody("utf8"));
                var l = [];
                for(var i = 0; i<result.results.length; i++) {
                    var obj = {
                        name: result.results[i].name,
                        icon: result.results[i].icon,
                        types: result.results[i].types,
                        rating: result.results[i].rating
                    }
                    l[i] = obj;
                }
                return l;
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
    var req_data = Request('GET', "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+City+"&types=geocode&key=" + GOOGLE_API_KEY);
    console.log("https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+City+"&types=geocode&key=" + GOOGLE_API_KEY);
    var data = JSON.parse(req_data.getBody("utf8"));
    var place = Request('GET', "https://maps.googleapis.com/maps/api/place/details/json?placeid="+data.predictions[0].place_id+"&key=" + GOOGLE_API_KEY);
    var data_place = JSON.parse(place.getBody("utf8"));
    return data_place.result.geometry.location;
}

exports.viewerType = viewerType;
exports.poiType = poiType;
exports.cittaType = cittaType;