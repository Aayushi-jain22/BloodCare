const express = require("express");
const router = express.Router();
const dcontroller = require("../controllers/donor");
const {donor_verify} = require("../helper.js");


router.route("/donorlogin")
  .get(function(req, res){
    res.render("donor/donorlogin");
  })
  .post(dcontroller.donorlogin);


router.route("/donorsignup")
  .get(function(req, res){
    res.render("donor/donorsignup");
  })
  .post(dcontroller.donorsignup);


router.get("/donor-dashboard", donor_verify, dcontroller.donor_dashboard);


router.route("/donate-blood")
  .get(donor_verify, function(req, res){
    res.render("donor/donate_blood");
  })
  .post(dcontroller.donate_blood);


router.get("/donation-history", donor_verify, dcontroller.donation_history);

router.get("/certificate/:name/:date", donor_verify, dcontroller.donor_certificate);

router.route("/make-request")
  .get(donor_verify, function(req, res){
    res.render("donor/makerequest1");
  })
  .post(dcontroller.make_request);


router.get("/request-history", donor_verify, dcontroller.request_history);

module.exports = router;