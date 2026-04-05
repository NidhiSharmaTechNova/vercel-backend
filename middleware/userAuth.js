// import jwt from 'jsonwebtoken';

// const userAuth = async(req,res,next) => {
//    const {token} = req.body;

//    if(!token){
//        return res.json({success: false, message: "Not Authorized Login Again"})
//    }

//    try {
    
//     const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

//     if(tokenDecode.id){
//         req.body.userId = tokenDecode.id
//     } else{
//         return res.json({success: false, message: "Not Authorized Login Again"})
//     }

//     next();

//    } catch (error) {
//       res.json({success: false , message:error.message});
//    }
// }

// export default userAuth;

// import jwt from 'jsonwebtoken';

// const userAuth = async (req, res, next) => {
//    try {
//        const authHeader = req.headers.authorization;

//        if (!authHeader) {
//            return res.json({ success: false, message: "No token provided" });
//        }

//        const token = authHeader.split(" ")[1];

//        const decoded = jwt.verify(token, process.env.JWT_SECRET);

//        req.userId = decoded.id;

//        next();

//    } catch (error) {
//        return res.json({ success: false, message: error.message });
//    }
// }

// export default userAuth;

import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;

// import jwt from 'jsonwebtoken';

// const userAuth = async (req, res, next) => {
//    const { token } = req.body;

//    if (!token) {
//        return res.json({ success: false, message: "Token missing" });
//    }

//    try {
//        const decoded = jwt.verify(token, process.env.JWT_SECRET);

//        if (!decoded.id) {
//            return res.json({ success: false, message: "Invalid token" });
//        }

//        req.userId = decoded.id; // ✅ FIX

//        next();

//    } catch (error) {
//        return res.json({ success: false, message: error.message });
//    }
// }

// export default userAuth;