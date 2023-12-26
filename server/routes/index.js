const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;

router.post('/api/login', passport.authenticate('local', {}), (req, res) => {
  const isValid = req.isAuthenticated();
  if (isValid) {
      res.json({ isLoggedIn: true, user: req.session.passport.user });
  } else {
      res.json({ isLoggedIn: false });
  }
});
 

 router.post('/api/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        fname: req.body.fname,
        lname : req.body.lname,
        hash: hash,
        salt: salt,
        admin: false,
        email : req.body.email
    });

    newUser.save()
    res.redirect("http://localhost:3000/login")
 });



// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;