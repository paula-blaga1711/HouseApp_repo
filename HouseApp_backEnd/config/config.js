const mongoose = require('mongoose');
module.exports = {
    database: 'mongodb+srv://cluster0-gn9a4.mongodb.net',
    databaseConfig: {
        useNewUrlParser: true,
        user: "adminPaula",
        pass: "szoszke007",
        dbName: 'HouseApp'
    }
};

var _ = require('lodash');
global._ = _;

global.pipe = function (obj, keys = []) {
    if (_.isEmpty(obj)) return {};

    let newObj = {};
    _.forIn(obj, function (value, key) {
        if (keys.indexOf(key) > -1) newObj[key] = obj[key];
    });

    return newObj;
}

global.responseMessages = {
    //#region User
    'noUser': "Utilizatorul nu exista!",
    'notLoggedIn': "Derularea procesului solicitat necesita autentificare in cadrul platformei.",
    'notConfirmed': "Pentru a accesa aceasta functionalitate este necesar sa aveti adresa de e-mail confirmata.",
    'noSuchUser': "Nu s-a gasit nici un utilizator de criteriul specificat",
    //#endregion

    //#region General
    'success': "Procesul a fost executat cu succes",
    'generalError': 'Ceva nu a mers bine!',
    'youCantDoThis': "Actiunea solicitata nu se poate efectua!",
    'unauthorizedAccess': "Acces neautorizat!", // sau "Nu ai acces la aceasta functionalitate"
    'entryNotFound': "Nu exista inregistrare cu acest identificator!",
    'nothingToUpdate': "Nu s-a specificat nici un parametru care se poate modifica",
    //#endregion

    //#region Data
    'allFieldsAreRequired': "Toate campurile sunt obligatorii!",
    'notEnoughData': "Date insuficiente!",
    'wrongData': "Datele nu se pot procesa!",
    'cantProcessImg': "Date insuficiente sau incorecte. Imaginile selectate nu se pot procesa!",
    'errorOnSave': "Nu s-a putut salva in baza de date",
    //#endregion

    //#region Houses
    'HouseNotFound': "Acest imobil nu exista!",
    'noSuchHouse': "Nu s-a gasit nici un imobil pe baza criteriilor specificate.",
    //#endregion

    //#region Filter
    'emptyFilter': "Nu s-a specificat nici un criteriu de filtrare",
    'emptyResult': "Nu s-a gasit nici o inregistrare pe baza criteriilor specificate."
    //#endregion
};

global.userProfileImgUrl = '../api/resources/user_profile_img/';
global.houseImgUrl = '../api/resources/house_img/';

module.exports.checkCounty = function (county) {
    counties = [
        'Alba',
        'Arad',
        'Arges',
        'Bacau',
        'Bihor',
        'Bistrita - Nasaud',
        'Botosani',
        'Braila',
        'Brasov',
        'Bucuresti',
        'Buzau',
        'Calarasi',
        'Caras - Severin',
        'Cluj',
        'Constanta',
        'Covasna',
        'Dambovita',
        'Dolj',
        'Galati',
        'Giurgiu',
        'Gorj',
        'Harghita',
        'Hunedoara',
        'Ialomita',
        'Iasi',
        'Ilfov',
        'Maramures',
        'Mehedinti',
        'Mures',
        'Neamt',
        'Olt',
        'Prahova',
        'Salaj',
        'Satu - Mare',
        'Sibiu',
        'Suceava',
        'Teleorman',
        'Timis',
        'Tulcea',
        'Valcea',
        'Vaslui',
        'Vrancea'
    ];

    if (_.includes(counties, county) === true) return true;
    else return false;
}

module.exports.checkCity = function (county, city) {
    //ToDo fill up AllCities by counties with real data
    let AllCities = {
        'Alba': ['Alba Iulia', 'Sebes', 'Aiud', 'Cugir', 'Blaj', 'Ocna Mures', 'Zlatna', 'Campeni', 'Teius', 'Abrud', 'Baia de Aries'],
        'Arad': ['Arad', 'Pecica', 'Santana', 'Lipova', 'Ineu', 'Chisineu Cris', 'Nadlac', 'Curtici', 'Pancota', 'Sebis'],
        'Arges': ['Pitesti', 'Mioveni', 'Campulung', 'Curtea de Arges', 'Stefanesti', 'Costesti', 'Topoloveni'],
        'Bacau': ["Bacau", " Onesti", " Moinesti", " Comanesti", "Buhusi", " Darmanesti", "Targu Ocna", "Slanic-Moldova"],
        'Bihor': ['Oradea', 'Salonta', 'Marghita', 'Sacueni', 'Beius', 'Valea lui Mihai', 'Alesd', 'Stei', 'Vascau', 'Nucet'],
        'Bistrita - Nasaud': ["Bistrita", "Beclean", "Sangeorz-Bai", "Nasaud"],
        'Botosani': ["Botosani", "Dorohoi", "Darabani", "Flamanzi", "Saveni", "Stefanesti", "Bucecea"],
        'Braila': ["Braila", " Ianca", " Insuratei ", " Faurei"],
        'Brasov': ["Brasov", " Fagaras", "Sacele", " Zarnesti", "Codlea", " Rasnov", " Victoria", " Rupea", " Ghimbav ", "Predeal"],
        'Bucuresti': ["Bucuresti"],
        'Buzau': ["Buzau", " Ramnicu Sarat", "Nehoiu", "Patarlagele", "Pogoanele"],
        'Calarasi': ["Calarasi", " Oltenita", "Budesti", "Fundulea", "Lehliu-Gara"],
        'Caras - Severin': ["Resita", " Caransebes", "Bocsa", "Moldova Noua", " Oravita", " Otelu Rosu", " Anina ", "Baile Herculane"],
        'Cluj': ["Cluj-Napoca", " Turda", "Dej", " Campia Turzii", " Gherla ", " Huedin"],
        'Constanta': ["Constanta", "Medgidia", "Mangalia", "Navodari", "Cernavoda", "Ovidiu", "Murfatlar", "Harsova", "Eforie", "Techirghiol", "Baneasa", "Negru Voda"],
        'Covasna': ["Sfantu Gheorghe", "Targu Secuiesc", "Covasna", "Baraolt", "Intorsura Buzaului"],
        'Dambovita': ["Targoviste", "Moreni", "Pucioasa", "Gaesti", "Titu", "Fieni", "Racari"],
        'Dolj': ["Craiova", "Bailesti", "Calafat", "Filiasi", "Dabuleni", "Segarcea", "Bechet"],
        'Galati': ["Galati", "Tecuci", "Targu Bujor", "Beresti"],
        'Giurgiu': ["Giurgiu", "Bolintin-Vale", "Mihailest"],
        'Gorj': ["Targu Jiu", "Motru", "Rovinari", "Bumbesti-Jiu", "Targu Carbunesti", "Turceni", "Tismana", "Novaci", "Ticleni"],
        'Harghita': ["Miercurea-Ciuc", "Odorheiu Secuiesc", "Gheorgheni", "Toplita", "Cristuru Secuiesc", "Vlahita", "Balan", "Borsec", "Baile Tusnad"],
        'Hunedoara': ["Deva", "Hunedoara", "Petrosani", "Vulcan", "Lupeni", "Petrila", "Orastie", "Brad", "Simeria", "Calan", "Hateg", "Uricani", "Geoagiu", "Aninoasa"],
        'Ialomita': ["Slobozia", "Fetesti", "Urziceni", "Tandarei", "Amara", "Fierbinti-Targ", "Cazanesti"],
        'Iasi': ["Iasi", "Pascani", "Harlau", "Targu Frumos", "Podu Iloaiei"],
        'Ilfov': ["Voluntari", "Pantelimon", "Buftea", "Popesti-Leordeni", "Bragadiru", "Chitila", "Otopeni", "Magurele"],
        'Maramures': ["Baia Mare", "Sighetu Marmatiei", "Borsa", "Baia-Sprie", "Viseu de Sus", "Targu-Lapus", "Seini", "Somcuta Mare", "Ulmeni", "Tautii Magheraus", "Cavnic", "Salistea de Sus", "Dragomiresti"],
        'Mehedinti': ["Drobeta-Turnu Severin", "Strehaia", "Orsova", "Baia de Arama", "Vanju Mare"],
        'Mures': ["Targu-Mures", "Reghin", "Sighisoara", "Tarnaveni", "Ludus", "Sovata", "Iernut", "Sarmasu", "Ungheni", "Miercurea Nirajului", "Sangeorgiu-de-Padure"],
        'Neamt': ["Piatra Neamt", "Roman", "Targu-Neamt", "Roznov", "Bicaz"],
        'Olt': ["Slatina", "Caracal", "Bals", "Corabia", "Scornicesti", "Draganesti-Olt", "Piatra Olt", "Potcoava"],
        'Prahova': ["Ploiesti", "Campina", "Baicoi", "Breaza", "Mizil", "Comarnic", "Valenii de Munte", "Boldesti-Scaeni", "Urlati", "Sinaia", "Busteni", "Plopeni", "Slanic", "Azuga"],
        'Salaj': ["Zalau", "Simleu Silvaniei", "Jibou", "Cehu Silvaniei"],
        'Satu - Mare': ["Satu Mare", "Carei", "Negresti-Oas", "Tasnad", "Livada", "Ardud"],
        'Sibiu': ["Sibiu", "Medias", "Cisnadie", "Avrig", "Agnita", "Dumbraveni", "Talmaciu", "Copsa Mica", "Saliste", "Miercurea Sibiului ", "Ocna Sibiului"],
        'Suceava': ["Suceava", "Falticeni", "Radauti", "Campulung Moldovenesc", "Vatra Dornei", "Vicovu de Sus", "Gura Humorului", "Dolhasca", "Liteni", "Salcea", "Siret", "Cajvana", "Frasin", "Brosteni", "Milisauti ", "Solca"],
        'Teleorman': ["Alexandria", "Rosiorii de Vede", "Turnu Magurele", "Zimnicea", "Videle"],
        'Timis': ["Timisoara", "Lugoj", "Sannicolau Mare", "Jimbolia", "Recas", "Faget", "Buzias", "Deta", "Gataia", "Ciacova"],
        'Tulcea': ["Tulcea", "Babadag", "Macin", "Isaccea", "Sulina"],
        'Valcea': ["Ramnicu Valcea", "Dragasani", "Babeni", "Calimanesti", "Horezu", "Brezoi", "Balcesti", "Berbesti", "Baile Olanesti", "Ocnele Mari", "Baile Govora"],
        'Vaslui': ["Vaslui", "Barlad", "Husi", "Negresti", "Murgeni"],
        'Vrancea': ["Focsani", "Adjud", "Marasesti", "Odobesti", "Panciu"]
    }

    let citiesOfCounty = (_.get(AllCities, `${county}`));
    if (_.includes(citiesOfCounty, city) === true) return true;
    return false
}

module.exports.checkMongooseID = function (mongooseID) {
    if (!mongoose.Types.ObjectId.isValid(mongooseID))
        return false;
    return true;
}