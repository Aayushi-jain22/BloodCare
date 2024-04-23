const express = require("express");
const router = express.Router();
const acontroller = require("../controllers/blood");
const {admin_verify,clearCookie} = require("../helper.js");

router.get("/", function(req, res){
  res.render("blood/index");
});

router.get("/logout", clearCookie,function(req, res){
  res.render("blood/logout");
});

router.route("/adminlogin")
  .get(function(req, res){
    res.render("blood/adminlogin");
  })
  .post(acontroller.adminlogin);

router.get("/admin-dashboard", admin_verify, acontroller.admin_dashboard);

router.get("/admin-donor", admin_verify, acontroller.admin_donor);

router.route("/update-donor/:id")
  .get(admin_verify, acontroller.update_donor)
  .post(admin_verify, acontroller.update_donor);

router.get("/delete-donor/:id", admin_verify, acontroller.delete_donor);

router.get("/admin-patient", admin_verify, acontroller.admin_patient);

router.route("/update-patient/:id")
  .get(admin_verify, acontroller.update_patient)
  .post(admin_verify, acontroller.update_patient);

router.get("/delete-patient/:id", admin_verify, acontroller.delete_patient);

router.get("/admin-donation", admin_verify, acontroller.admin_donation);

router.get("/approve-donation/:id/:bloodgroup/:unit", admin_verify, acontroller.admin_approve_donation);

router.get("/reject-donation/:id", admin_verify, acontroller.admin_reject_donation);

router.get("/admin-request", admin_verify, acontroller.admin_request);

router.get("/update-approve-status/:id/:bloodgroup/:unit", admin_verify, acontroller.admin_approve_request);

router.get("/update-reject-status/:id", admin_verify, acontroller.admin_reject_request);

router.get("/admin-request-history", admin_verify, acontroller.admin_request_history);

router.route("/admin-blood")
  .get(admin_verify, acontroller.admin_blood)
  .post(admin_verify, acontroller.admin_blood);

router.get("/admin-best-donor", admin_verify, acontroller.admin_best_donor);

module.exports = router;
