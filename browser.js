var ReactDOM = require('react-dom');
var App = require('./App');



ReactDOM.render(

  <Relay.RootContainer Component={App.Container} route={App.queries}
    onReadyStateChange={({error}) => { if (error) console.error(error) }} />,

  document.getElementById('content')
);