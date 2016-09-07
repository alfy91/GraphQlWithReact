var graphql = require('graphql');
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLList = graphql.GraphQLList;
var under = require('underscore');
var db = require('./database');
var GraphQLObjectType = graphql.GraphQLObjectType;

var agencyType=new GraphQLObjectType({
    name:'Agency',
    description:"Agency",
    fields:{
        id: {
            type: GraphQLString,
            description: "Id of the agency"
        },
        titolo: {
            type: GraphQLString,
            description: "Title of the agency"
        },
        code: {
            type: GraphQLString,
            description: "Agency code"
        },
    }
});

var userType = new GraphQLObjectType({
    name: "User",
    description: "Member of The Users",
    fields: {
        id: {
            type: GraphQLString,
            description: "Id dell'utente"
        },
        name: {
            type: GraphQLString,
            description: "Nome dell'utente"
        },
        username: {
            type: GraphQLString,
            description: "Username dell'utente"
        },
        email: {
            type: GraphQLString,
            description: "Codice agenzia utente"
        },
        agency:{
            type:agencyType,
            description:"User agency",
            resolve:function(_,args) {
                return under.find(under.values(db.agencies),function(agency){
                    return agency.id==_.agency;
                });
            }
        }
    }
});



var viewerType = new GraphQLObjectType({
    name: "Viewer",
    description: "Viewer",
    fields: {
        users: {
            type: new GraphQLList(userType),
            description: "list of Users",
            resolve: function (_, args) {
                return under.values(db.users);
            }
        }
    }
});

exports.userType = userType;
exports.viewerType = viewerType;