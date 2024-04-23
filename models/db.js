const express = require("express");
const mysql = require("mysql");

const Db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

// Db.query("CREATE DATABASE if not exists bloodcare", (err) => {
//   if (err) {
//     throw err;
//   }
// });

Db.query(
  "CREATE TABLE if not exists `admin` (`username` varchar(25) NOT NULL,`password` char(60) NOT NULL,PRIMARY KEY (`username`))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  (err) => {
    if (err) {
      throw err;
    } else {
      Db.query(
        "INSERT INTO admin (username, password) SELECT * FROM (SELECT 'admin', 'Admin123') AS tmp WHERE NOT EXISTS (SELECT username FROM admin WHERE username = 'admin') LIMIT 1;",
        (error) => {
          if (error) {
            throw error;
          }
          console.log("Admin --");
          console.log("username- admin");
          console.log("password- Admin123");
        }
      );
    }
  }
);

Db.query(
  "CREATE TABLE if not exists `donor` (`first_name` varchar(20) NOT NULL, `last_name` varchar(45) NOT NULL, `username` varchar(15) NOT NULL, `password` char(60) NOT NULL, `blood_group` varchar(3) NOT NULL, `address` varchar(255) NOT NULL, `mobile` bigint NOT NULL, `profile_pic` mediumblob NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `count` int DEFAULT '0', PRIMARY KEY (`id`), UNIQUE KEY `username_UNIQUE` (`username`), UNIQUE KEY `mobile_UNIQUE` (`mobile`)) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  (err) => {
    if (err) {
      throw err;
    }
  }
);

Db.query(
  "CREATE TABLE if not exists `patient` (`first_name` varchar(20) NOT NULL, `last_name` varchar(45) NOT NULL, `username` varchar(15) NOT NULL, `password` char(60) NOT NULL, `age` int NOT NULL, `blood_group` varchar(3) NOT NULL, `disease` varchar(255) NOT NULL, `doctor_name` varchar(45) NOT NULL, `address` varchar(255) NOT NULL, `mobile` bigint NOT NULL, `profile_pic` mediumblob NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`), UNIQUE KEY `username_UNIQUE` (`username`), UNIQUE KEY `mobile_UNIQUE` (`mobile`)) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  (err) => {
    if (err) {
      throw err;
    }
  }
);

Db.query(
  "CREATE TABLE if not exists `blood_request` (`patient_name` varchar(45) NOT NULL,`patient_age` int NOT NULL,`reason` varchar(500) NOT NULL,`blood_group` varchar(3) NOT NULL,`unit` int NOT NULL DEFAULT '0',`doctor_name` varchar(45) NOT NULL,`hospital_name` varchar(255) NOT NULL,`hospital_no` bigint NOT NULL,`status` varchar(20) NOT NULL DEFAULT 'Pending',`date` datetime NOT NULL,`request_by_patient` int DEFAULT NULL,`request_by_donor` int DEFAULT NULL,KEY `request_by_patient_idx` (`request_by_patient`),KEY `request_by_donor_idx` (`request_by_donor`),CONSTRAINT `request_by_donor` FOREIGN KEY (`request_by_donor`) REFERENCES `donor` (`id`) ON DELETE CASCADE,CONSTRAINT `request_by_patient` FOREIGN KEY (`request_by_patient`) REFERENCES `patient` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  (err) => {
    if (err) {
      throw err;
    }
  }
);

Db.query(
  "CREATE TABLE if not exists `blood_donate` (`blood_group` varchar(3) NOT NULL,`unit` int unsigned NOT NULL DEFAULT '0',`disease` varchar(255) NOT NULL DEFAULT 'nothing',`age` int unsigned NOT NULL,`samagra_id` mediumblob NOT NULL,`status` varchar(20) NOT NULL DEFAULT 'Pending',`date` datetime NOT NULL,`donor` int NOT NULL,KEY `donor_idx` (`donor`),CONSTRAINT `donor` FOREIGN KEY (`donor`) REFERENCES `donor` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  (err) => {
    if (err) {
      throw err;
    }
  }
);

Db.query(
  "CREATE TABLE if not exists `stock` (`blood_group` varchar(3) NOT NULL,`unit` int unsigned NOT NULL DEFAULT '0') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  (err) => {
    if (err) {
      throw err;
    } else {
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'A+') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'A+') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'A-') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'A-') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'B+') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'B+') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'B-') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'B-') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'O+') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'O+') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'O-') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'O-') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'AB+') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'AB+') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      Db.query(
        "INSERT INTO stock (blood_group) SELECT * FROM (SELECT 'AB-') AS tmp WHERE NOT EXISTS (SELECT blood_group FROM stock WHERE blood_group = 'AB-') LIMIT 1;",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }
  }
);

module.exports = Db;
