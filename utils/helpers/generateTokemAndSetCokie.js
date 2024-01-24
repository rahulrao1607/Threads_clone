import jwt from "jsonwebtoken";

const generateTokenAndSetCookie =(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d',
    });

    res.cookie("jwt",token,{
        httpOnly: true, // this cookie cannot be accessed by the browser (more secure)
        maxAge : 15*24*60*1000,
        sameSite: "strict", //CSRF

    });
    return token;
};

export default generateTokenAndSetCookie;