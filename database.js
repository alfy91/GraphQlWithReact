var jQuery = require('jquery');
/*var users = {
    1: {
        character: "Beverly Goldberg",
        actor: "Wendi McLendon-Covey",
        role: "matriarch",
        traits: "embarrassing, overprotective",
        id: 1,
        agency: 1
    },
    2: {
        character: "Murray Goldberg",
        actor: "Jeff Garlin",
        role: "patriarch",
        traits: "gruff, lazy",
        id: 2,
        agency: 3
    },
    3: {
        character: "Erica Goldberg",
        actor: "Hayley Orrantia",
        role: "oldest child",
        traits: "rebellious, nonchalant",
        id: 3,
        agency: 3
    },
    4: {
        character: "Barry Goldberg",
        actor: "Troy Gentile",
        role: "middle child",
        traits: "dim-witted, untalented",
        id: 4,
        agency: 4
    },
    5: {
        character: "Adam Goldberg",
        actor: "Sean Giambrone",
        role: "youngest child",
        traits: "geeky, pop-culture obsessed",
        id: 5,
        agency: 4
    },
    6: {
        character: "Albert 'Pops' Solomon",
        actor: "George Segal",
        role: "grandfather",
        traits: "goofy, laid back",
        id: 6,
        agency: 4
    }
}*/



//var agencies =
Request = require('sync-request');
//var agencies = Request('GET', 'https://extra-refactory.logotel.it/temp/data.json');
var users = Request('GET', 'http://192.168.33.22/index.php?option=com_users&controller=user&task=user.getAllUsers');
var agencies = Request('GET', 'http://192.168.33.22/index.php?option=com_users&controller=user&task=user.getAllAgencies');

exports.agencies = JSON.parse(agencies.getBody("utf8"));
exports.users = JSON.parse(users.getBody("utf8"));;



