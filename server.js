var express = require('express');
var schema = require('./schema');
var graphqlHTTP = require('express-graphql');

var app = express();


app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
app.use('/react', express.static('./node_modules/react/dist'));
app.use('/react-dom', express.static('./node_modules/react-dom/dist'));
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));

app.use('/relay', express.static('./node_modules/react-relay/dist'));
app.use('/', express.static('./public'));

app.listen(8080, function() { console.log('Listening on 8080...') });