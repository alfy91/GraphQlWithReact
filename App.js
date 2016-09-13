var React = require('react');
var Relay = require('react-relay');
class App extends React.Component {
  render() {
    return(
      <div>
        <h2>Test</h2>
        <div >
            <p>Tempo:{this.props.viewer.citta.meteo.tempo}</p>
            <p>Temperatura: {this.props.viewer.citta.meteo.temp}</p>
        </div>
        <Citta dati={this.props.viewer.citta} />
      </div>
    )
  }  
}


class Citta extends React.Component{
  render(){
    return (
      <table class="table table-striped">
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Voto</th>
            <th>Note</th>
          </tr>
          {this.props.dati.puntiInteresse.map(puntoInteresse =>
            <SingleCitta dati={puntoInteresse} />
          )}
      </table> 
    )
  }
}

class SingleCitta extends React.Component {
  render() {

    var poi = this.props.dati;

    return (
      <tr>
          <td><img width="30" height="30" src={poi.icon}/></td>
          <td>{poi.name }</td>
          <td>{poi.rating }</td>
          <td>{poi.types }</td>
      </tr>
    )
  }
}

exports.Container = Relay.createContainer(App, {
  fragments: {

    viewer: () => Relay.QL`
      fragment on Viewer {
         citta(name: \"Caserta\") {
            puntiInteresse {
              name,
              rating,
              types,
              icon
            },
            meteo {
              temp,
              tempo
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