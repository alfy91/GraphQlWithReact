var React = require('react');
var Relay = require('react-relay');
class App extends React.Component {
  render() {
    return(
      <div>
        <h2>Test</h2>
        <Users users={this.props.viewer.users} />
      </div>
    )
  }  
}
class Users extends React.Component{
  render(){
    return (
      <table class="table table-striped">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Username</th>
            <th>Agenzia</th>
          </tr>
          {this.props.users.map(user =>
            <User user={user} />
          )} 
      </table> 
    )
  }
}

class User extends React.Component {
  render() {

    var user = this.props.user;
    return (
      <tr>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.username}</td>
        <td>{user.agency.titolo}</td>
      </tr>
    )
  }
}

exports.Container = Relay.createContainer(App, {
  fragments: {

    viewer: () => Relay.QL`
      fragment on Viewer {
          users{
            id,
            username,
            name,
            agency {
              id,
              titolo
            }
          }
      }
    `
  }
});


exports.queries = {
  name: 'AppQueries', // can be anything, just used as an identifier
  params: {},
  queries: {
    viewer: () => Relay.QL`query { viewer }`
  }
};