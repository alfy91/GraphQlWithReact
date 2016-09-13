var graphql = require('graphql');
var GraphQLInt = graphql.GraphQLInt;
var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLObjectType = graphql.GraphQLObjectType;
var types = require('./types');
var under = require('underscore');
var db = require('./database');
var GraphQLRelay = require('graphql-relay');
var mysql = require('mysql');
var GraphQLList = graphql.GraphQLList;
var GraphQLString = graphql.GraphQLString;
var GOOGLE_API_KEY = "AIzaSyAahonfOsE-ZyvVgNbjJ67ja3dhN7UFA4Y";
var Request = require('sync-request');

var queryType = new GraphQLObjectType({
    name: "query",
    description: "User query",
    fields: {
        citta: {
            type: types.cittaType,
            args: {
                name: {
                    type: GraphQLString
                }
            },
            resolve: function (_, args) {
                return {"name": (args.name)};
            }
        },

        viewer: {
            type: types.viewerType,
            fields: {
                id: GraphQLRelay.globalIdField('viewer')
            },
            args: {
                name: {
                    type: GraphQLString
                }
            },
            resolve: function (_, args) {
                return {"name": (args.name)};
            }
        }

    }

});






var schema = new GraphQLSchema({
    query: queryType
});

module.exports = schema;