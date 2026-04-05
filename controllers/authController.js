import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

//Signup
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    console.log(req.body);

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details" })
    }

    try {

        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.json({ success: false, message: "user already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashPassword })
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure:true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 🔥 email ko alag try-catch me daalo
        try {
            const mailOptions = {
                //  from: `"Auth System" <${process.env.SENDER_EMAIL}>`,
                // to: email,
                // subject: "Welcome to Auth System 🚀",
                // html: `
                // <h2>Welcome 🎉</h2>
                // <p>Your account has been created successfully.</p>
                // <p><b>Email:</b> ${email}</p>

                from: `"Auth System" <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: "Welcome to Auth System 🚀",
                text: `Welcome to Auth website. Your account has been created  with email id: ${email}`
            };

            await transporter.sendMail(mailOptions);

        } catch (mailError) {
            console.log("Email Error:", mailError.message);
        }

        // return res.json({ success: true });
        return res.json({ success: true, token });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Login
export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "missing details" })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "user iss invaild" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "invaild password" })
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'string',
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite:'None', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, token: token });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            // maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Logged Out " })
    } catch (error) {
        return res.json({ success: false, meassage: error.message })
    }
}

//sendverify OTP 
export const sendverifyOtp = async (req, res) => {
    try {
        const userId = req.userId; 

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: `"Auth System" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Verification OTP sent on email" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.userId;

    if (!otp) {
        return res.json({ success: false, message: "Missing OTP" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const isAuthentication = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// export const sendResetOtp = async (req, res) => {

//     const { email } = req.body;

//     // if(!email){
//     //     res.json({success:false, message: "Email is required"});
//     // }
//     if (!email) {
//         return res.json({ success: false, message: "Email is required" });
//     }

//     try {

//         const user = await userModel.findOne({ email });

//         if (!user) {
//             res.json({ success: false, message: "User not found" });
//         }


//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         user.resetOtp = otp;
//         user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

//         await user.save();

//         const mailOptions = {
//             from: `"Auth System" <${process.env.SENDER_EMAIL}>`,
//             to: user.email,
//             subject: "Password reset OTP",
//             text: `Your OTP is resetting your password ${otp}. Use this OTP`
//         };

//         await transporter.sendMail(mailOptions);

//         return res.json({ success: true, message: "Otp sent to your email" })

//     } catch (error) {
//         return res.json({ success: false, message: message.error });
//     }
// }


// export const resetPassword = async(req,res) => {

//     const {email,otp,newPassword} = req.body;

//     if(!email || !otp || !newPassword){
//         return res.json({success: false, message: "Email , OTP and newPassword are required"});
//     }

//    try {

//     const user = await userModel.findOne({email});

//     if(!user){
//          return res.json({success: false, message: "user not found"});
//     }

//     if(user.resetOtp === '' || user.resetOtp === 'otp'){
//         return res.json({success: false, message: "Invaild OTP"});
//     }

//     if(user.resetOtpExpireAt < Date.now()) {
//         return res.json({success: false, message: "OTP Expired"});
//     }

//     const hashedPassword = await bcrypt.hash(newPassword,10);

//     user.password = hashedPassword;
//     user.resetOtp = '';
//     user.resetOtpExpireAt = 0;

//     await user.save();

//       return res.json({success:true, message:"Password has been reset successfully" });

//    } catch (error) {
//      return res.json({success: false, message: message.error})
//    }
// }

// export const sendResetOtp = async (req, res) => {

//     const { email } = req.body;

//     if (!email) {
//         return res.json({ success: false, message: "Email is required" });
//     }

//     try {

//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         user.resetOtp = otp;
//         user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

//         await user.save();

//         const mailOptions = {
//             from: `"Auth System" <${process.env.SENDER_EMAIL}>`,
//             to: user.email,
//             subject: "Password reset OTP",
//             text: `Your OTP is ${otp}`
//         };

//         await transporter.sendMail(mailOptions);

//         return res.json({ success: true, message: "Otp sent to your email" });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// }


export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: `"Auth System" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    console.log("BODY:", req.body); 

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP and newPassword are required" });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.resetOtp || user.resetOtp.toString() !== otp.toString()) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}