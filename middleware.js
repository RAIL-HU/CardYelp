module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Please login before you proceed');
        return res.redirect('/login');
    }
    next();
}