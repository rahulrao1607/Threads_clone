import User from "../model/userModel.js";
import Post from "../model/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../utils/helpers/generateTokemAndSetCokie.js';
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";


// gettting user profile

const getUserProfile =async(req,res)=>{
    const { query } = req.params;
    try {
		// query is userId		
        let user;
        if(mongoose.Types.ObjectId.isValid(query))
        {
             user = await User.findOne({ _id: query}).select("-password").select("-updatedAt");
        }
        //query id username
        else{
             user = await User.findOne({ username: query}).select("-password").select("-updatedAt");
        }
	    if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}    
};
// Singing in user
const signupUser =async(req,res)=>{

    try {

        const { name, email, username, password }= req.body;
        const user =await User.findOne({ $or: [{ email }, { username }]});

        if(user){
            return res.status(400).json({error :"User already exists"});
        }
        const salt =await bcrypt.genSalt(10);
        const hashPassword =await bcrypt.hash(password,salt);

        const newUser =new User({
            name,
            email,
            username,
            password :hashPassword
        });
        await newUser.save();
        if(newUser)
        {
            generateTokenAndSetCookie(newUser._id,res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio : newUser.bio,
                profilePic :newUser.profilePic,
            });
        } else{
            res.status(400).json({error:"invalid user"});
        }
        
    } catch (error) {
        res.status(500).json({error :error.message})
        console.log("Error Message:",error.message);        
    }

};
// loging in user

const loginUser =async(req,res)=>{
    try {
        const {username, password} =req.body;
        const user =await User.findOne({username});
        const isPasswordCorrect =await bcrypt.compare(password,user?.password || "");
        
        if(!user || !isPasswordCorrect) return res.status(400).json({error:"Inavlid username or password"});
   
        generateTokenAndSetCookie(user._id,res);
   
        res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio : user.bio,
        profilePic :user.profilePic,
    });        
    } catch (error) {
        res.status(500).json({error :error.message})
        console.log("Error Message:",error.message);        
    }

};

// loging out user

const logoutUser =async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge: 1});
        res.status(200).json({message:"User logout Sucessfully"}) ;
        
    } catch (error) {
        res.status(500).json({error :error.message})
        console.log("Error Message:",error.message);  
        
    }

};

//follow and unfollow user

const followUnFollowUser =async(req,res)=>{
    try {
        const {id}=req.params;
        //console.log("abcde",id);
        const userToModify =await User.findById(id);
        const currentUser =await User.findById(req.user._id);
        

        if(id === req.user._id.toString()) 
                return res.status(400).json({error:"you cannot unfollow and follow yourself"});

        if(!userToModify || !currentUser) 
                return res.status(400).json({error :"User not found"});

        const isFollowing =currentUser.following.includes(id);

        if(isFollowing){
            //unfollow and modify current user following and followers
            await User.findByIdAndUpdate(id,{$pull:{follower :req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull: {following: id}});

            res.status(200).json({message:"User unfollowed Sucessfully"});
        } else{
            //follow
            await User.findByIdAndUpdate(req.user._id,{$push: {following: id}});
            await User.findByIdAndUpdate(id,{$push:{follower :req.user._id}});
            res.status(200).json({message:"User followed Sucessfully"});
        }        
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("Error in follow/unfollow:",error.message); 
    }
};

// updating user profile

const updateUser =async(req,res)=>{
    const { name, email, username, password, bio } = req.body;
    let { profilePic } =req.body;
	const userId = req.user._id;
    try {
        let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

         if (req.params.id !== userId.toString())
         {
         console.log(req.params.id);
        console.log(userId);
		 	return res.status(400).json({ error: "You cannot update other user's profile" });
         }

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

        if(profilePic)
        {
            if(user.profilePic)
            {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse =await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();
        await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

        //password not to be stored in localstorage
        user.password = null;


        res.status(200).json(user);      
    } catch (error) {
        res.status(500).json({error :error.message})
        console.log("Error in updating Profile:",error.message);
        
    }   
};





export {signupUser,loginUser,logoutUser,followUnFollowUser,updateUser,getUserProfile};