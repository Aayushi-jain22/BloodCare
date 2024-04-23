require('dotenv').config();
const Db = require("../models/db");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
// const jwt_decode = require("jwt-decode");

exports.adminlogin = (req, res) => {
	username = req.body.username;
	password = req.body.password;

	const admin = Db.query("SELECT * FROM admin WHERE username = ? && password = ?", [username, password], function(err, results){
		if(err){
			res.redirect("/adminlogin");
		}
		else{
            var token = jwt.sign(
                {username: username}, 
                process.env.ADMIN_SECRETKEY
            );
            res.cookie("jwttoken", token, {httpOnly: true});
            
			res.redirect("/admin-dashboard");	
		}
	});
};

exports.admin_donor = (req, res) => {

	Db.query("SELECT * FROM donor", (err, result) => {
		if(err){
			throw err;
		}
		res.render("blood/admin_donor", {donor: result});
	});
};

exports.update_donor = (req, res) => {
	if(req.method === "GET"){
		Db.query("SELECT * from donor WHERE id = ?",[req.params.id], (err, result) => {
			if(err){
				throw err;
			}
			res.render("blood/update_donor",{donor:result});
		});
	}
	else if (req.method === "POST"){

		bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
	    	first_name = req.body.first_name,
			last_name = req.body.last_name,
			username = req.body.username,
			password = hash,
			blood_group = req.body.bloodgroup,
			address = req.body.address,
			mobile = req.body.number,
			profile_pic = req.body.profile_pic

			Db.query("UPDATE donor set first_name = ?, last_name = ?, username = ?, password = ?, blood_group = ?, address = ?, mobile = ?, profile_pic = ? WHERE id = ?",
				[first_name, last_name, username, password, blood_group, address, mobile, profile_pic, req.params.id], 
				(err) => {
					if(err){
						throw err;
					}
					res.redirect("/admin-donor");
			}); 
		});
	}
};

exports.delete_donor = (req, res) => {

	Db.query("DELETE FROM donor WHERE id = ?", [req.params.id], (err) => {
		if(err){
			throw err;
		}
		res.redirect("/admin-donor");
	});
};

exports.admin_patient = (req, res) => {

	Db.query("SELECT * FROM patient", (err, result) => {
		if(err){
			throw err;
		}
		res.render("blood/admin_patient", {patient: result});
	});
};

exports.update_patient = (req, res) => {
	if(req.method === "GET"){
		Db.query("SELECT * from patient WHERE id = ?",[req.params.id], (err, result) => {
			if(err){
				throw err;
			}
			res.render("blood/update_patient",{patient:result});
		});
	}
	else if (req.method === "POST"){

		bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
	    	first_name = req.body.first_name,
			last_name = req.body.last_name,
			username = req.body.username,
			password = hash,
			age = req.body.age,
			blood_group = req.body.bloodgroup,
			disease = req.body.disease,
			doctor_name = req.body.doctor,
			address = req.body.address,
			mobile = req.body.number,
			profile_pic = req.body.profile_pic

			Db.query("UPDATE patient set first_name = ?, last_name = ?, username = ?, password = ?, age = ?, blood_group = ?, disease = ?, doctor_name = ?, address = ?, mobile = ?, profile_pic = ? WHERE id = ?",
				[first_name, last_name, username, password, age, blood_group, disease, doctor_name, address, mobile, profile_pic, req.params.id], 
				(err) => {
					if(err){
						throw err;
					}
					res.redirect("/admin-patient");
			}); 
		});
	}
};

exports.delete_patient = (req, res) => {

	Db.query("DELETE FROM patient WHERE id = ?", [req.params.id], (err) => {
		if(err){
			throw err;
		}
		res.redirect("/admin-patient");
	});
};

exports.admin_blood = (req, res) => {
	if(req.method === "GET"){

		Db.query("SELECT * FROM stock", (err, result) => {
			if(err){
				throw err;
			}
			else{
				res.render("blood/admin_blood", {A1:result[0].unit, A2:result[1].unit, B1:result[2].unit, B2:result[3].unit, O1:result[4].unit, O2:result[5].unit, AB1:result[6].unit, AB2:result[7].unit}); 
			}
		});
	}
	else if(req.method === "POST"){
		
		blood_group = req.body.bloodgroup,
		unit = req.body.unit

		Db.query("UPDATE stock set unit = ? WHERE blood_group = ?",[unit, blood_group], (err) => {
			if(err){
				throw err;
			}
			res.redirect("/admin-blood");
		});
	}
};

exports.admin_donation = (req, res) => {
	Db.query("select donor.first_name, donor.last_name, blood_donate.* from donor join blood_donate on id = donor;", (err, result) => {
		if(err){
			throw err;
		}
		else {
			res.render("blood/admin_donation", {donation:result});
		}
	});
};

exports.admin_approve_donation = (req, res) => {
	
	donor = req.params.id;
	blood_group = req.params.bloodgroup;
	unit = req.params.unit;

	Db.query("UPDATE stock set unit = unit + ? WHERE blood_group = ?",[unit, blood_group], (err) => {
		if(err){
			throw err;
		}
		else{

			Db.query("UPDATE blood_donate set status = 'Approved' where donor = ? && status = 'Pending'",[donor], (err) => {
				if(err){
					throw err;
				}
				else{
					Db.query("UPDATE donor join blood_donate on id = donor set count = count + 1 WHERE blood_donate.status = 'Approved' AND donor.id = ?",[donor], (err) => {
						if(err){
							throw err;
						}
						else{
							res.redirect("/admin-donation");
						}
					});
					
				}
			});
		}
	});
};

exports.admin_reject_donation = (req, res) => {
	Db.query("UPDATE blood_donate set status = 'Rejected' where donor = ? && status = 'Pending'",[req.params.id], (err) => {
		if(err){
			throw error;
		}
		else{
			res.redirect("/admin-donation");
		}
	});
};

exports.admin_request = (req, res) => {
	Db.query("SELECT * FROM blood_request WHERE status = 'Pending'", (err, result) => {
		if(err){
			throw err;
		}
		else{
			res.render("blood/admin_request", {request: result, message: "" });
		}
	});
};

exports.admin_approve_request = (req, res) => {
	id = req.params.id;
	blood_group = req.params.bloodgroup;
	unit = req.params.unit;
	var message ;
	Db.query("SELECT unit FROM stock WHERE blood_group = ?",[blood_group], (err,result) => {
		if(err){
			throw err;
		}
		else{
			stock_unit = result[0].unit;
			if(stock_unit > unit){
				Db.query("UPDATE stock set unit = unit - ? WHERE blood_group = ?",[unit, blood_group], (err) => {
					if(err){
						throw err;
					}
					else{
						Db.query("UPDATE blood_request set status = 'Approved' where (request_by_patient = ? || request_by_donor = ?) && status = 'Pending'",[id, id], (err) => {
							if(err){
								throw err;
							}
						});
					}
				});
			}
			else{
				message = "Stock Doest Not Have Enough Blood To Approve This Request, Only " + stock_unit +" Unit Available !";
			}

			Db.query("SELECT * FROM blood_request WHERE status = 'Pending'", (err, result) => {
				if(err){
					throw err;
				}
				else{
					res.render("blood/admin_request", {request: result, message: message });
				}
			});
		}
	});
};

exports.admin_reject_request = (req, res) => {

	id = req.params.id;

	Db.query("UPDATE blood_request set status = 'Rejected' where (request_by_patient = ? || request_by_donor = ?) && status = 'Pending'",[id, id], (err) => {
		if(err){
			throw error;
		}
		else{
			res.redirect("/admin-request");
		}
	});
};

exports.admin_request_history = (req, res) => {
	Db.query("SELECT * FROM blood_request WHERE status NOT IN ('Pending')", (err, result) => {
		if(err){
			throw err;
		}
		else{
			res.render("blood/admin_request_history", {request:result});
		}
	});
};

exports.admin_dashboard = (req, res) => {
	Db.query("select (select unit from stock where blood_group = 'A+') as 'A1', (select unit from stock where blood_group = 'A-') as 'A2', (select unit from stock where blood_group = 'B+') as 'B1', (select unit from stock where blood_group = 'B-') as 'B2', (select unit from stock where blood_group = 'O+') as 'O1', (select unit from stock where blood_group = 'O-') as 'O2', (select unit from stock where blood_group = 'AB+') as 'AB1', (select unit from stock where blood_group = 'AB-') as 'AB2', (select count(*) from donor) as total_donors, (select count(*) from blood_request) as total_requests, (select count(*) from blood_request where status = 'Approved') as approved_requests, (select sum(unit) from stock) as total_blood from dual", (err, result) => {
		if(err){
			throw err;
		}
		else{
			res.render("blood/admin_dashboard",
				{
					A1:result[0].A1,
					A2:result[0].A2,
					B1:result[0].B1,
					B2:result[0].B2,
					O1:result[0].O1,
					O2:result[0].O2,
					AB1:result[0].AB1,
					AB2:result[0].AB2,
					total_donors:result[0].total_donors,
					total_requests:result[0].total_requests,
					approved_requests:result[0].approved_requests,
					total_blood:result[0].total_blood
				});
		}
	});
};

exports.admin_best_donor = (req, res) => {
	Db.query("select * from donor order by count desc", (err, result) => {
		if(err){
			throw err;
		}
		else{
			res.render("blood/admin_best_donor", {donor:result});
		}
	});
};