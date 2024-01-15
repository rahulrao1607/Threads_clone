import { Avatar, Flex ,Image,Text ,Box, Divider, Spinner } from "@chakra-ui/react";
import useGetUserProfilr from "../hooks/useGetUserProfilr";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import Actions from "../components/Actions";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comment from "../components/Comment";
import postsAtom from "../atoms/postsAtom";


const PostPage =()=>{   
  const {user,loading} = useGetUserProfilr();
  const showToast = useShowToast();
  const {pid} = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [posts,setPosts] = useRecoilState(postsAtom);

  const currentPost = posts[0];

  useEffect(()=> {

    const getPost =async () => {

        try {
            const res = await fetch(`/api/posts/${pid}`);
            const data =await res.json();
            
            if(data.error)
            {
                showToast("Error",data.error,"error");
                return;
            }
            setPosts([data]);
        
        } catch (error) {
    
            showToast("Error",error.message,"error");    
        }
    };

    getPost();
    
  },[showToast,pid,setPosts]);

  const handleDelete = async ()=>{
    try {
        if(!window.confirm("Are you sure you want to delte this post")) return;

        const res = await fetch(`/api/posts/${currentPost._id}`,{
            method: "DELETE",
        });
        const data= await res.json();
        if(data.error)
        {
            showToast("Error",data.error,"error");
            return;
        }
        showToast("Success","Post Deleted Sucessfully","success");
        navigate(`/${user.username}`);
       
    } catch (error) {
        showToast("Error",error.message,"error");
        
    }
};

  if(!user && loading){
    return (
        <Flex justifyContent={"center"} >
            <Spinner  size={"xl"} />
        </Flex>
    );
  } 

   if(!currentPost) return null;
   
    return <>
    <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={user.profilePic} size={"md"} name="Mark Zuckberg"/>
            <Flex>
                <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
                <Image src='/verified.png' w="4" h={4} ml={4}/>
            </Flex>
        </Flex>
        <Flex gap={4} alignItems={"centre"}>
            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                 {formatDistanceToNow(new Date(currentPost.createdAt))} ago
            </Text>
            {currentUser?._id === user._id && (
                 <DeleteIcon size={20} onClick={handleDelete}/>
            )}
        </Flex>
    </Flex>

    <Text my={3}>{currentPost.text}</Text>
    {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
        <Image src={currentPost.img} w={"full"} />
     </Box>
    )}
    
     <Flex gap={3} my={3}>
         <Actions post={currentPost}/> 
     </Flex>
     <Divider my={4} />
     {currentPost.replies.map(reply =>(

        <Comment
          key= {reply._id}
          reply ={reply}
     />
     ))}
     
       
    </>
}
export default PostPage;