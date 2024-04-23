require('dotenv').config();
const express = require("express");
const jwt = require('jsonwebtoken');

exports.patient_verify = (req, res, next) => {

	var token = req.cookies.jwttoken;
	if(token){
		jwt.verify(token, process.env.PATIENT_SECRETKEY, (err, payload) => {
			if(err){
				console.log(err);
			}else{
				req.payload = payload;
				next();
			}
		});
	}
	
};

exports.donor_verify = (req, res, next) => {

	var token = req.cookies.jwttoken;
	if(token){
		jwt.verify(token, process.env.DONOR_SECRETKEY, (err, payload) => {
			if(err){
				console.log(err);
			}else{
				req.payload = payload;
				next();
			}
		});
	}
	
};

exports.admin_verify = (req, res, next) => {

	var token = req.cookies.jwttoken;
	if(token){
		jwt.verify(token, process.env.ADMIN_SECRETKEY, (err, payload) => {
			if(err){
				console.log(err);
			}else{
				req.payload = payload;
				next();
			}
		});
	}
	
};

exports.clearCookie = (req, res, next) => {
	res.clearCookie("jwttoken");
	next();
};