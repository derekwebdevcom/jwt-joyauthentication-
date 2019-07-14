const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const secretOrKey = require('../config/keys');





router.post('/register', async (req, res) => {
const { error } = registerValidation(req.body);
if (error) return res.status(400).send(error.details[0].message);

// Check for user in database

const emailExist = await User.findOne({email: req.body.email})
if(emailExist) return res.status(400).send('Email already exists');

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);


    const user = new User({
      name:req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    try{
      const savedUser = await user.save();
      res.send({ user: user._id});
    } catch(err){
      res.status(400).send(err);
    }
});

//login

router.post('/login', async (req,res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
//Check for user
  const user = await User.findOne({ email:req.body.email });
  if (!user) return res.status(400).send('Email is not found');
  //password correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send('Invalid password');

  // Create and assign token
  const token = jwt.sign({_id: user._id}, 'secretOrKey');
  res.header('auth-token', token).send(token);


});


module.exports = router;
