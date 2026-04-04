// import userModel from "../models/userModel.js";


// export const getUserData = async (req, res) => {
//     try {

//         const { userId } = req.body;

//         const user = await userModel.findById({ userId });

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         res.json({
//             success :true,
//             userDate: {
//                 name:user.name,
//                 isAccountVerified: user.isAccountVerified
//             }
//         })

//     } catch (error) {
//         res, json({ success: false, message: message.error })
//     }
// }

import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {

        const userId = req.userId; // ✅ middleware se

        const user = await userModel.findById(userId); // ✅ FIX

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        return res.json({ success: false, message: error.message }); // ✅ FIX
    }
};