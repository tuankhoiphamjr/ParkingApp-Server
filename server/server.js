const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
var morgan = require("morgan");

const app = express();

const db = require("./models");
const dbConfig = require("./config/db.config");
const Role = db.role;

const user = require("./services/user.service");

// Connect to DB
db.mongoose
      .connect(dbConfig.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
      })
      .then(() => {
            console.log("Successfully connect to MongoDB.");
            initial();
      })
      .catch((err) => {
            console.error("Connection error", err);
            process.exit();
      });

var corsOptions = {
      origin: "http://localhost:8081",
};

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("tiny"));

app.use(function (req, res, next) {
      res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
      );
      next();
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
});

// test------------------------------------------------------------------------

// app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}.`);
// });
// routes
app.use("/api", require("./routes"));

// set port, listen for requests

// test------------------------------------------------------------------------

app.get("/", (req, res) => {
      res.status(200).send({ message: "123" });
});

function initial() {
      Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                  new Role({
                        name: "user",
                  }).save((err) => {
                        if (err) {
                              console.log("error", err);
                        }

                        console.log("added 'user' to roles collection");
                  });

                  new Role({
                        name: "moderator",
                  }).save((err) => {
                        if (err) {
                              console.log("error", err);
                        }

                        console.log("added 'moderator' to roles collection");
                  });

                  new Role({
                        name: "admin",
                  }).save((err) => {
                        if (err) {
                              console.log("error", err);
                        }

                        console.log("added 'admin' to roles collection");
                  });
            }
      });
}
