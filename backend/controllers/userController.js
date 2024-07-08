const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError"); 
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicurl"
        }
    });
      sendToken(user,201,res);
});
//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    //checking is user has given email and password both
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email and password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }
    // is password matched function is made in usermodel
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }
    sendToken(user, 200, res);

});


//logout user 
exports.logout = catchAsyncError(async (req, res, next) => {
    
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,

    });



    res.status(200).json({
        success: true,
        message: "Logged out ",

    });


});

// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        
        return next(new ErrorHander("User not found", 404));
    }
    // get reset password token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n if you have not requested this email than please ignore it`;
    try {

        await sendEmail({
            email: user.email,
            subject: `ClasherStop password recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHander(error.message, 500));
    }

});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        user,
    });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHander("old password you entered is incorrect", 400));
    }
     if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHander("password doesnt match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});
//update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
    }
    // we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
   // await user.save();
    res.status(200).json({
        success: true,
    });
});
//get all users-admin
exports.getAlluser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});
//get single user details- admin
exports.getSingleuser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHander(`User does not exit with id :${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user,
    });
});
//update user role -- admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
   
    res.status(200).json({
        success: true,
    });
});
//delete user profile--admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }


  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});