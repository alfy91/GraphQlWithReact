var graphql = require('graphql');
var GraphQLInt = graphql.GraphQLInt;
var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLObjectType = graphql.GraphQLObjectType;
var types = require('./types');
var under = require('underscore');
var db = require('./database');
var GraphQLRelay = require('graphql-relay');

var GraphQLList = graphql.GraphQLList;


var queryType = new GraphQLObjectType({
    name: "query",
    description: "User query",
    fields: {
        user: {
            type: types.userType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: function (_, args) {
                return getUser(args.id)
            }
        },
        users: {
            type: new GraphQLList(types.userType),
            resolve: function (_, args) {
                return under.values(db.users);
            }
        },
        viewer: {
            type: types.viewerType,
            fields: {
                id: GraphQLRelay.globalIdField('viewer')
            },
            resolve: function (_, args) {
                return {}
            }
        }

    }

});

function getUser(id) {
    for(var i = 0; i < db.users.length; i++) {
        if(db.users[i].id == id) {
            return db.users[i];
        }
    }
    return null;
}


var schema = new GraphQLSchema({
    query: queryType
});

module.exports = schema;