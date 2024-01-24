import  express  from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import {v2 as cloudinary} from "cloudinary";
import cors from "cors";

dotenv.config();


connectDB();
const app =express();
const PORT =process.env.PORT || 3000;

cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key :process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});


//midleware

app.use(express.json({limit:"50mb"})); // to parse JSON data in the req.body
app.use(express.urlencoded({extended:true}));  //to parse from data in the req.body
app.use(cookieParser());

//Routes

app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);

app.use(cors(
    {
        origin: ["https://threads-clone-frontend-flax.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));


app.get("/", (req, res) => {
    res.send("Hello, I am here and running!");
  });

app.listen(PORT ,()=>{
    console.log(`server started at port: ${PORT}`);
}); 
