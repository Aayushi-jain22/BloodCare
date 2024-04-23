require('dotenv').config();
const Db = require("../models/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwt_decode = require("jwt-decode");

exports.donorsignup = (req, res) => {

	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    	first_name = req.body.first_name,
		last_name = req.body.last_name,
		username = req.body.username,
		password = hash,
		blood_group = req.body.bloodgroup,
		address = req.body.address,
		mobile = req.body.mobile,
		profile_pic = req.body.profile_pic

		const donor = Db.query("INSERT INTO donor(first_name, last_name, username, password, blood_group, address, mobile, profile_pic) VALUES (?,?,?,?,?,?,?,?)",
				[first_name, last_name, username, password, blood_group, address, mobile, profile_pic], function(err){
					if(err){
						console.log(err);
					}else{
						res.redirect("/donor/donorlogin");
					}
				}
		); 
	});
	
};

exports.donorlogin = (req, res) => {

	username = req.body.username,
	password = req.body.password

	const info = Db.query("SELECT * FROM donor WHERE username = ?", [username], function(err, results){
		if(results.length > 0){

			const hash = results[0].password;

			bcrypt.compare(password, hash, function(err, result) {

		    	if(result === true){
		    		var token = jwt.sign(
		    			{ username: results[0].username,
		    			user_id: results[0].id}, 
		    			process.env.DONOR_SECRETKEY,
		    			{expiresIn: "1h"}
		    		);
		    		res.cookie("jwttoken", token, {expires:new Date(Date.now() + 3.6e+6), httpOnly: true});
		    		
		    		res.redirect("/donor/donor-dashboard");	
		    	}
		    	else{
					res.redirect("/donor/donorlogin");
				}
			});
		}
	});
};

exports.donate_blood = (req, res) => {
	
	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	blood_group = req.body.bloodgroup,
	unit = req.body.unit,
	disease = req.body.disease,
	age = req.body.age,
	samagra_id = req.body.samagra_id
	donor = decoded.user_id

	Db.query("INSERT INTO blood_donate (blood_group, unit, disease, age, samagra_id, date, donor) VALUES(?,?,?,?,?,now(),?);",
	[blood_group, unit, disease, age, samagra_id, donor], (err) => {
		if(err){
			throw err;
		}else{
			res.redirect("/donor/donation-history");
		}
	});

};

exports.donation_history = (req, res) => {
	
	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	donor = decoded.user_id;

	Db.query("SELECT donor.first_name, donor.last_name, blood_donate.* FROM blood_donate join donor on donor = id WHERE donor = ?",[donor], (err, result) => {
		if(err){
			throw err;
		}
		res.render("donor/donation_history", {donation:result});
	});
};

exports.donor_certificate = (req, res) => {
	name = req.params.name;
	date = req.params.date;

	res.render("donor/certificate", {Name: name, Date: date});
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
	request_by_donor = decoded.user_id
	
	Db.query("INSERT INTO blood_request (patient_name, patient_age, reason, blood_group, unit, doctor_name, hospital_name, hospital_no, date, request_by_donor) VALUES(?,?,?,?,?,?,?,?,now(),?);",
	[patient_name, patient_age, reason, blood_group, unit, doctor_name, hospital_name, hospital_no, request_by_donor], (err) => {
		if(err){
			throw err;
		}else{
			res.redirect("/donor/request-history");
		}
	});
};

exports.request_history = (req, res) => {
	
	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	request_by_donor = decoded.user_id;

	Db.query("SELECT blood_request.*, blood_donate.samagra_id from blood_request join blood_donate on request_by_donor = donor WHERE request_by_donor = ?",[request_by_donor], (err, result) => {
		if(err){
			throw err;
		}
		res.render("donor/request_history", {request:result});
	});
};

exports.donor_dashboard = (req, res) => {
	
	Token = req.cookies.jwttoken;
	decoded = jwt_decode(Token);

	request_by_donor = decoded.user_id;

	Db.query("select count(*) as request_made, count(if(status = 'Pending', 1,null)) as pending_request, count(if(status = 'Approved', 1,null)) as approved_request, count(if(status = 'Rejected', 1,null)) as rejected_request from blood_request where request_by_donor = ?", [request_by_donor], (err, result) => {
		if(err){
			throw err;
		}
		else{
			res.render("donor/donor_dashboard",
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