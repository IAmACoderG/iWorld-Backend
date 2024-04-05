const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const requiredFieldCretiria = [//not required but if you want other wise ignore it
   body('firstName', 'Enter The Valid Name').isLength({ min: 3 }),
   body('lastName', 'Enter The Valid Name').isLength({ min: 3 }),
   body('email', 'Enter The Valid Email').isEmail(),
   body('password', 'Password must be Atleast minimum length of 5').isLength({ min: 5 })
]
//Create User ...>>>
router.post('/createUser', requiredFieldCretiria, async (req, res) => {

   let success = false;
   let { firstName, lastName, email, password } = req.body;

   //if there are error ,return bad request and errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
   }

   try {
      // Before Creating the User Check the User may Be Exist Or Not..
      let userExistOrNot = await User.findOne({ email });
      if (userExistOrNot) {
         return res.status(400).json({ success, Error: "Sorry This user with this Email Already Exist" })
      };

      //Converted the password in hash
      const salt = await bcrypt.genSalt(10);
      const squrPass = await bcrypt.hash(password, salt);

      //create user
      let user = await User.create({ firstName, lastName, email, password: squrPass });
      if (!user) {
         return res.status(400).json({ success, Error: "Error Occcur While Creating User" })
      }

      // Generate the token 
      const data = { user_id: user._id };
      const authToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      success = true;

      //if Everything is Ok Send Success True and Token
      return res.status(201).json({ success, authToken });

   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

// Login User...>>>
let fieldcreteria = [//not required but if you want other wise ignore it
   body('email', 'Enter The Valid Email').isEmail(),
   body('password', 'Password can not be Blank').exists()
]
router.post('/login', fieldcreteria, async (req, res) => {

   let success = false;
   const { email, password } = req.body;

   //if there are error ,return bad request and errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   try {
      let user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ success, Error: "Please try to login with the correct credentials" });
      };

      //Password Checking Correct Or Not...>
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
         success = false
         return res.status(400).json({ success, Error: "Please try to login with the correct Password" });
      }
      // Generate the token 
      const data = {
         user_id: user._id
      }
      const authToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      success = true;
      return res.status(200).json({ success, authToken, userExist: data });

   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

//Route 3:Get LoggedIn User Details user using POST "/api/auth/getuser". login Required
router.post('/getuser', fetchuser, async (req, res) => {
   //if there are error ,return bad request and errors

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   try {
      const userId = req.user._id;
      let user = await User.findById(userId).select("-password")
      res.send(user);
      if (!user) {
         return res.status(400).json({ Error: "Please try to login with the correct credentials" });

      }
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
});

module.exports = router

