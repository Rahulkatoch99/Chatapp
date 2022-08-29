// const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const { Registration } = require("../models/userModel");

var jwt = require("jsonwebtoken");

exports.AuthRegistration = async (req, res) => {
  try {
    const { email } = req.body;
    const userEmail = await Registration.findOne({ email: email });
    if (userEmail) {
      res.status(400).json({ message: "Email is already present.." });
    }

    // return Registration.updateOne({resetLink:tokken},function(err,sucess){
    //   if(err){
    //     return res.status(400).json({error:"rest assword lik error"})
    //   }else{
    //     res.status(200).json({message:data})
    //   }
    // })

    const password = req.body.password;
    const Confirmpassword = req.body.Confirmpassword;

    if (password === Confirmpassword) {
      const passwordHash = await bcrypt.hash(password, 10);
      const Register = new Registration({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        img: req.body.img,
        password: passwordHash,
      });
      console.log(Register);

      const save = await Register.save();
      if (save) {
        res.status(201).json({ message: "data save successfully..." });
      }
    } else {
      console.log("password incorrect..");
    }
  } catch (errr) {
    console.log(errr);
  }
};

//-------------------------------------------Auth Login-----------------------------------------//

exports.AuthLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next("password and email both are required...");
  }

  try {
    const user = await Registration.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ error: "email is not match...." });

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(comparePassword);

    if (!comparePassword) {
      return res.status(400).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    //signing token with user id
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // save the user token

    user.token = token;

    //responding request with user profile success message and  access token .
    res.status(200).send({
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
      },
      message: "Login successfull",
      accessToken: token,
    });

    // return res.status(200).json({message:"Login sucessfully"});
  } catch (err) {
    console.log(err);
    alert(err.message);
    return next("error : ", err);
  }
};

///////////////////////////---------------------------------------------------------------------------------------------------------///////////////////

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
// const allUsers = asyncHandler(async (req, res) => {
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
//   res.send(users);
// });

// //@description     Register new user
// //@route           POST /api/user/
// //@access          Public

// //@description     Auth the user
// //@route           POST /api/users/login
// //@access          Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       pic: user.pic,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid Email or Password");
//   }
// });

// module.exports = { allUsers, authUser };
