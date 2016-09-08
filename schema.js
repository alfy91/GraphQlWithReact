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
    Request = require('sync-request');
    var req_users = Request('GET', 'http://192.168.33.22/index.php?option=com_users&controller=user&task=user.getAllUsers');
    var users = JSON.parse(req_users.getBody("utf8"));
    for(var i = 0; i < users.length; i++) {
        if(users[i].id == id) {
            return users[i];
        }
    }
    return null;
}


var schema = new GraphQLSchema({
    query: queryType
});

module.exports = schema;