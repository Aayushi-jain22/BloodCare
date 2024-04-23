require('dotenv').config();
const Db = require("../models/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwt_decode = require("jwt-decode");


exports.patientsignup = (req, res) => {

	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    	first_name = req.body.first_name,
		last_name = req.body.last_name,
		username = req.body.username,
		password = hash,
		age = req.body.age,
		blood_group = req.body.bloodgroup,
		disease = req.body.disease,
		doctor_name = req.body.doctor_name,
		address = req.body.address,
		mobile = req.body.mobile,
		profile_pic = req.body.profile_pic

		const patient = Db.query("INSERT INTO patient(first_name, last_name, username, password, age, blood_group, disease, doctor_name, address, mobile, profile_pic) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
				[first_name, last_name, username, password, age, blood_group, disease, doctor_name, address, mobile, profile_pic], function(err){
					if(err){
						console.log(err);
					}else{
						res.redirect("/patient/patientlogin");
					}
				}
		); 
	});
	
};

exports.patientlogin = (req, res) => {

	
	username = req.body.username,
	password = req.body.password

	const info = Db.query("SELECT * FROM patient WHERE username = ?", [username], function(err, results){
		if(results.length > 0){

			const hash = results[0].password;

			bcrypt.compare(password, hash, function(err, result) {
		    	if(result === true){
		    		var token = jwt.sign(
		    			{ username: results[0].username,
		    			user_id: results[0].id}, 
		    			process.env.PATIENT_SECRETKEY,
		    			{expiresIn: "1h"}
		    		);
		    		res.cookie("jwttoken", token, {expires:new Date(Date.now() + 3.6e+6), httpOnly: true});

		    		res.redirect("/patient/patient-dashboard");	
		    	}
		    	else{
					res.redirect("/patient/patientlogin");
				}
			});
		}
	});
};

exports.make_request = (req, res) => {

	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	patient_name = req.body.patient_name,
	patient_age = req.body.patient_age,
	reason = req.body.reason,
	blood_group = req.body.bloodgroup,
	unit = req.body.unit,
	doctor_name = req.body.doctor_name,
	hospital_name = req.body.hospital_name,
	hospital_no = req.body.hospital_no,
	request_by_patient = decoded.user_id
	
	Db.query("INSERT INTO blood_request (patient_name, patient_age, reason, blood_group, unit, doctor_name, hospital_name, hospital_no, date, request_by_patient) VALUES(?,?,?,?,?,?,?,?,now(),?);",
	[patient_name, patient_age, reason, blood_group, unit, doctor_name, hospital_name, hospital_no, request_by_patient], (err) => {
		if(err){
			throw err;
		}else{
			res.redirect("/patient/my-request");
		}
	});
};

exports.my_request = (req, res) => {

	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	request_by_patient = decoded.user_id;

	Db.query("SELECT * FROM blood_request WHERE request_by_patient = ?",[request_by_patient], (err, result) => {
		if(err){
			throw err;
		}
		res.render("patient/my_request", {request:result});
	});
};

exports.patient_dashboard = (req, res) => {
	
	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	request_by_patient = decoded.user_id;

	Db.query("select count(*) as request_made, count(if(status = 'Pending', 1,null)) as pending_request, count(if(status = 'Approved', 1,null)) as approved_request, count(if(status = 'Rejected', 1,null)) as rejected_request from blood_request where request_by_patient = ?", [request_by_patient], (err, result) => {
		if(err){
			throw err;
		}
		else{
			res.render("patient/patient_dashboard",
				{
					request_made:result[0].request_made,
					pending_request:result[0].pending_request,
					approved_request:result[0].approved_request,
					rejected_request:result[0].rejected_request
				}
			);
		}
	});
};
