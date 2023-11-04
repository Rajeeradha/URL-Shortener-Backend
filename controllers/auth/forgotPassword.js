const { UserDetails } = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// Forget password send in mail
const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    // first to check the email in database
    let user = await UserDetails.findOne({ email: email });
    if (user) {
      let token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
        expiresIn: "10m",
      });
      let url = `${process.env.BASE_URL}/forgot-password-page/${user._id}/${token}`;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 993,
        secure: false, 
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAILPASSWORD, 
        },
      });
      let details = {
        from: "radhanov12@gmail.com", 
        to: user.email, 
        subject: "Password Reset Link", 
        text: `Reset link`, 
        html: `<div style=" border:3px solid blue; padding : 20px;"><span>Password Reset Link : - </span> <a href=${url}> Click
          here !!!</a>
      <div>
          <h4>
              Note :-
              <ul>
                  <li>This link only valid in 10 minitues</li>
              </ul>
          </h4>
      </div>
  </div>`,
      };

      await transporter.sendMail(details, (err) => {
        if (err) {
          res.json({
            statusCode: 200,
            message: "it has some error for send a mail",
          });
        } else {
          res.json({
            statusCode: 200,
            message: "Password Reset link send in your mail",
          });
        }
      });
    } else {
      res.json({
        statusCode: 401,
        message: " Please enter vaild email address",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = { forgotPassword };
