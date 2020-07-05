const auth = require('http-auth');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
// const ClientRegistration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
  res.render('form', { title: 'Registration form' });
});

// router.get('/client', (req, res) => {
//   res.render('cform', { title: 'Registration form' });
// });

router.post('/',
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('agenceyid')
      .isLength({ min: 1 })
      .withMessage('Please enter an agenceyid'),
      check('address1')
      .isLength({ min: 1 })
      .withMessage('Please enter an address1'),
      check('state')
      .isLength({ min: 1 })
      .withMessage('Please enter an state'),
      check('city')
      .isLength({ min: 1 })
      .withMessage('Please enter an city'),
      check('phone')
      .isLength({ min: 1 })
      .withMessage('Please enter an phone'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration.save()
        .then(() => { res.send('Thank you for your registration!'); })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
        });
    } else {
      console.log("tets")
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
  });

router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
}));

module.exports = router;

