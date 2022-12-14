const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {
                return next(err);
            }
            else {
                req.flash('success', 'Registration was successful. Welcome!')
                res.redirect('/stores');
            }
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Login was successful!');
    const redirectUrl = req.session.returnTo || '/stores';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(catchAsync);
    req.flash('success', 'Successfully logged you out!');
    res.redirect('/');
};