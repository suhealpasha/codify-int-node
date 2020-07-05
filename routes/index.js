const auth = require("http-auth");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const Registration = mongoose.model("Registration");
const ClientRegistration = mongoose.model("ClientRegistration");
const basic = auth.basic({
  file: path.join(__dirname, "../users.htpasswd"),
});

router.get("/agencey", (req, res) => {
  res.render("form", { title: "Registration form" });
});

router.get("/client", (req, res) => {
  res.render("cform", { title: "Registration form" });
});

router.post(
  "/agencey",
  [
    check("name").isLength({ min: 1 }).withMessage("Please enter a name"),
    check("agenceyid")
      .isLength({ min: 1 })
      .withMessage("Please enter a agenceyid"),
    check("address1")
      .isLength({ min: 1 })
      .withMessage("Please enter a address1"),
    check("state").isLength({ min: 1 }).withMessage("Please enter a state"),
    check("city").isLength({ min: 1 }).withMessage("Please enter a city"),
    check("phone").isLength({ min: 1 }).withMessage("Please enter a phone"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration
        .save()
        .then(() => {
          res.send("Thank you for your registration!");
        })
        .catch((err) => {
          console.log(err);
          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.render("form", {
        title: "Registration form",
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

router.post(
  "/client",
  [
    check("name").isLength({ min: 1 }).withMessage("Please enter a name"),
    check("agenceyid")
      .isLength({ min: 1 })
      .withMessage("Please enter a agenceyid"),
    check("name").isLength({ min: 1 }).withMessage("Please enter a name"),
    check("email").isLength({ min: 1 }).withMessage("Please enter a email"),
    check("phone").isLength({ min: 1 }).withMessage("Please enter a phone"),
    check("totalbill")
      .isLength({ min: 1 })
      .withMessage("Please enter a totalbill"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const registration = new ClientRegistration(req.body);
      var myquery = { agenceyid: req.body.agenceyid };
      Registration.updateOne(myquery, { $set: { clients: req.body } }).then(
        (res) => {
          console.log(res);
        }
      );

      registration
        .save()
        .then(() => {
          res.send("Thank you for your registration!");
        })
        .catch((err) => {
          console.log(err);
          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.render("cform", {
        title: "Registration form",
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

router.put("/updateclient",
(req, res) => {
const registration = new ClientRegistration(req.body);
var newValues = req.body;
var query = {clientid:req.body.clientid}
ClientRegistration.updateOne(query,newValues)
.then(res=>{res.send("Updated sucesfully")})
.catch(err =>{console.log(err)})
}
)

router.get("/topclients",
(req,res)=>{
  Registration.aggregate(
    [  
        {$unwind : "$clients"},

        {
          "$group" : {
              "_id" : "$_id",  
                      
              "totalbill" : {"$max" : "$clients.totalbill"},             
          },
          
      }
       
    ])
  .then(res=>{
    const maxPeak = res.reduce((p, c) => p.totalbill > c.totalbill ? p : c);
    console.log(maxPeak)
  })
}
)

router.get(
  "/registrations",
  basic.check((req, res) => {
    Registration.find()
      .then((registrations) => {
        res.render("index", { title: "Listing registrations", registrations });
      })
      .catch((err) => {
        console.log(err);
        res.send("Sorry! Something went wrong.");
      });
  })
);

module.exports = router;
