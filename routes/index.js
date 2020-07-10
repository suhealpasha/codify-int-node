const auth = require("http-auth");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const {ObjectId} = require('mongodb'); 
const { check, validationResult } = require("express-validator");

const router = express.Router();
const Registration = mongoose.model("Registration");
const ClientRegistration = mongoose.model("ClientRegistration");
const basic = auth.basic({
  file: path.join(__dirname, "../users.htpasswd"),
});



router.post(
  "/register/agencey",
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
          res.send({
            status: 200,
            data: req.body,
            message: "Data inserted Sucessfully",
          });
        })
        .catch((err) => {
          console.log(err);
          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.send({
        errors: errors.array(),
        data: req.body,
        message: "Missing Details",
      });
    }
  }
);

router.post(
  "/register/client",
  [
    check("clientid")
      .isLength({ min: 1 })
      .withMessage("Please enter a Client Id"),
    check("name").isLength({ min: 1 }).withMessage("Please enter a name"),
    check("agenceyid")
      .isLength({ min: 1 })
      .withMessage("Please enter a agenceyid"),
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
      Registration.findOne(myquery)
        .then((data) => {
          if (data !== null) {
            Registration.updateOne(myquery, {
              $set: { clients: req.body },
            }).then(
              registration.save().then(() => {
                res.send({
                  status: 200,
                  data: req.body,
                  message: "Data inserted Sucessfully",
                });
              })
            );
          } else {
            res.send({ status: 403, message: "Agencey Id not available!" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.send({
        errors: errors.array(),
        data: req.body,
        message: "Missing Details",
      });
    }
  }
);




router.put("/updateclient", (req, res) => {
  const registration = new ClientRegistration(req.body);
  var newValues = req.body; 
  var query = { clientid: req.body.clientid };
  ClientRegistration.findOne(query)
  .then(
    data=>{
      if(data){
        ClientRegistration.updateOne(query, req.body, function (err, result) {
          res.send(
              (err === null) ? {"status":200,"data": req.body,"message":"updated Sucessfully"} : {msg: err}
          )
      })
    }
      else{
        res.send({"status":403,"message":"invalid Client Id","data":req.body})
      }
    }
    )
    
}
)
router.get(
  "/topclients",
 (req, res) => {
    let maxPeak;
    Registration.aggregate([
      { $unwind: "$clients" },

      {
        $group: {
          _id: "$_id",          
          totalbill: { $max: "$clients.totalbill" },
        },
      },
    ])

      .then((data) => {
        let agName;
        maxPeak = data.reduce((p, c) => (p.totalbill > c.totalbill ? p : c));                
        res.send({"result":maxPeak,"Agencey Name":agName})       
      })      
      .catch((err) => {
        console.log(err);
      });
   
  }
);



module.exports = router;
