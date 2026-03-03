const User =  require("../models/user.js");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup")
}

module.exports.signUp = async(req,res)=>{
    try{

        let {username,email,password} = req.body;
        const newUser =  new User({username,email });
        const registerUser = await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}


module.exports.login = 
  (req, res) => {
    
    req.flash("success", "welcome Back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl;
    if(redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }

  }


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}