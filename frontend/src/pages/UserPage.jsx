import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from"../components/Post";
import useGetUserProfilr from "../hooks/useGetUserProfilr";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage =()=>{  
  const {user,loading} = useGetUserProfilr();
  const {username} = useParams();
  const showToast = useShowToast();
  const [posts,setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(()=> {
       
    const getPost = async()=> {
      setFetchingPosts(true);
      try {

        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);        
        
      } catch (error) {
        showToast("Error",error.message,"error");        
      } finally{
        setFetchingPosts(false);
      }
    };

    getPost();
  },[username ,showToast,setPosts]);

  console.log("posts is here and its recoil state",posts);
  
  if(!user && loading)
  {
    return (
      <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
      </Flex>
    )
  }


  if(!user && !loading) return <h1>User Not Found !!!!</h1>;
  

    return(
    <>
      <UserHeader user={user}/>
      {!fetchingPosts && posts.length === 0 && <h1>USer has not posted anything</h1> }
      {fetchingPosts &&(
      <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"} />
      </Flex>
      )}

      {posts.map((post)=>(
                <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))} 
     
    </> 
    );
};  
export default UserPage; 