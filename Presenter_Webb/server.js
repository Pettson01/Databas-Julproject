//Moduler
const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const path = require('path')
const app = express();
const mysql = require('mysql')
const presentFunktioner = require('./public/js/PresentFunktioner.js')

//Middlewear
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorhandler());
app.use('/static', express.static('public'))

//Skapar metoder
const {getIndexPage, getSlumpadPresent, postPresent} = require('./public/js/PresentFunktioner.js');


//Databasen
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "christmasDB"
});

global.con = con;

//Ansluter till datanasen
con.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');

/*
    //Skapar tabellen
      var sql = "CREATE TABLE presenter (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), picture_adress VARCHAR(255), link VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table 'presenter' created");
      });
*/

});

//Olika requsts
app.get('/', getIndexPage);
app.get('/slumpadPresent', getSlumpadPresent);
app.post('/add', postPresent);


app.listen(3000);

//Ifal flera presenter ska läggas till måste postman användas och det som ska stå i body ska se ut såhär:
/*
Det måste vara "POST" med adressen: http://localhost:3000/add

T.ex.:
{
	"name":"Boeing BBJ",
	"picture_adress":"https://corporatejetinvestor.com/wp-content/uploads/2015/02/Vertis-Aviation-BBJ-9H-BBJ-1-890x395.jpg",
	"link":"https://www.avbuyer.com/aircraft/private-jets/boeing/bbj/352247"
}
*/
