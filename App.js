var React = require('react');
var Relay = require('react-relay');
class App extends React.Component {
    render() {

        return(
            <div>
                <h2>Informazioni della città {this.props.viewer.citta.name}</h2>
                <div >
                  <Meteo dati={this.props.viewer.citta.meteo} />
                </div>
                <Citta dati={this.props.viewer.citta} />
            </div>
        )
    }
}

class Meteo extends React.Component{
    render() {
        return (
            <div>
                {this.props.dati.map(meteo =>
                    <SingleMeteo dati={meteo}/>
                )}
            </div>
        )
    }
}

class SingleMeteo extends React.Component{
    render() {
        var dato = this.props.dati;
        return (
            <div>
                <p>Servizio di {dato.servizio}</p>
                <p>Temperatura:{dato.temp}</p>
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
            name,
            puntiInteresse {
              name,
              rating,
              types,
              icon
            },
            meteo {
              temp,
              servizio
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