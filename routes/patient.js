const express = require("express");
const router = express.Router();
const pcontroller = require("../controllers/patient");
const {patient_verify} = require("../helper.js");


router.route("/patientlogin")
  .get(function(req, res){
    res.render("patient/patientlogin");
  })
  .post(pcontroller.patientlogin);


router.route("/patientsignup")
  .get( function(req, res){
    res.render("patient/patientsignup");
  })
  .post(pcontroller.patientsignup);


router.get("/patient-dashboard", patient_verify, pcontroller.patient_dashboard);


router.route("/make-request")
  .get(patient_verify, function(req, res){
    res.render("patient/makerequest");
  })
  .post(pcontroller.make_request);


router.get("/my-request", patient_verify, pcontroller.my_request);

module.exports = router;