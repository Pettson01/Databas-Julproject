//Moduler
const mysql = require('mysql');
const express = require('express');
const path = require('path');

let app = express();

app.use('/static', express.static('public'))

//Skapar en global variabel i detta dokument
let a;



//Med två punkter backar man ett steg i explorer
module.exports = {
  //Funktion för indexsidan
    getIndexPage: (req, res) => {
      res.sendFile(path.join(__dirname, '../html/index.html'));
    },

    //Funktion då man kommer in på /slumpadPresent
    getSlumpadPresent: (req, res) => {

      let random = 0;
      let id = 1;

        //Räknar hur många rader det finns i tabellen så att slump generatorn inte generar något som är undefined
        var sql = "select COUNT(*) AS count from presenter";

        con.query(sql, function (err, rows) {
          if (err) throw err;

          //Lagrar resultatet från sql koden ovan i en variabel som sedan används för att skapa ett random tal mellan 1 och 'count'
          const count = rows[0].count;
          console.log("Amount of presents in table: " + count);
          random = Math.floor(Math.random() * count) + 1
          console.log("The random number: " + random);
          id = random;

                  //Tar ut en rad ur tabellen som ligger i databasen med värdet som skapades ovan

                  let query = "SELECT * FROM `presenter` WHERE id = '" + id + "' ";

                  con.query(query, function(err, result) {
                    if (err) throw err;
                    console.log("Name: " + result[0]["name"])
                    a = result;

                    global.a = a;


                    //Med hjälp av en ejs fil kan man föra över variableran data till andra filen och in till client side.
                    res.render(path.join(__dirname, '../html/slumpadPresentMedEjs.ejs'),
                    {presentNamn: a[0].name,
                     linktTillBild:a[0].picture_adress,
                     linktTillPresent:a[0].link});

                  });
        });
    },
    //Funktionen som gör det möjligt att lägga till fler presenter
    postPresent: (req, res) => {

      //Sparar ner all inmatad data från body till 3 variabler
      let nameA = req.body.name.toString();
      let picture_adressA = req.body.picture_adress.toString();
      let linkA = req.body.link.toString();


      //Variablerna sätts in i sql query och sedan är det inne i tabellen i databasen
      var sql = "INSERT INTO presenter (name, picture_adress, link) VALUES ('" + nameA + "', '" + picture_adressA + "', '" + linkA + "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 present insterted");
        console.log(JSON.stringify(req.body, null, 2));
      });

      res.status(201).send("1 present Insterted");
    }
};
