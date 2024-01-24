import { Link,Text,Box, Flex, VStack, Portal, useToast} from "@chakra-ui/react";
import {Avatar} from "@chakra-ui/avatar";
import {MenuButton, Menu , MenuList, MenuItem } from "@chakra-ui/menu";
import {BsInstagram} from "react-icons/bs";
import { Button } from "@chakra-ui/react";
import {CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link as RouterLink} from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader =({user})=>{
const toast = useToast();
const currentUser =useRecoilValue(userAtom);
const [following, setFollowing] = useState(user.follower.includes(currentUser?._id));
const[updating, setUpdating] =useState(false);
const showToast = useShowToast();


const handleFollow = async() => {

    if(!currentUser)
    {
        showToast("Error", "Please login first", "error");
        return;
    }
    if(updating) return;
    setUpdating(true);

    try {
        const res= await fetch(`/api/users/follow/${user._id}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        if(data.error)
        {
            showToast("Error",data.error, "error");
            return;
        }
        if(following)
        {
            showToast("Sucessfull.",`Unfollowed ${user.name}`,"success");
            user.follower.pop();
        }
        else
        {
            showToast("Sucessfull.",`followed ${user.name}`,"success");           
            user.follower.push(currentUser?._id);

        }
        setFollowing(!following);      
    } catch (error) {
        showToast("Error.",error,"error");       
    }
    finally{
        setUpdating(false);
    }
};

    const copyURL =()=>{
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(()=>{
            toast({
                title: 'Sucessfull.',
                description: "profile link copied",
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
        });
    };
    return(
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
            <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"sm"}>{user.username}</Text>
                <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                    thread.next
                </Text>
            </Flex>
        </Box>
        <Box>
            {user.profilePic && (
                <Avatar 
                name= {user.name}
                src={user.profilePic}
                size={
                    { base:"md",
                      md: "xl",
                    }
                }/>
            )}
            {!user.profilePic && (
                <Avatar 
                name={user.name} 
                src="https://source.unsplash.com/featured/300x201"
                 size={
                    { base:"md",
                      md: "xl",
                    }
                }/>
            )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to='/update'>
        <Button size={"sm"} >Update Profile </Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollow} isLoading={updating} > 
        {following ? "unfollow" : "Follow"}
         </Button>        
        )}




      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{user.follower.length} followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
            <Box className='icon-container'>
                <BsInstagram size={24} cursor={"pointer"}/>
            </Box>
            <Box className='icon-container'>
                <Menu>
                    <MenuButton>
                        <CgMoreO  size={24} cursor={"pointer"}/>
                    </MenuButton>
                    <Portal>
                        <MenuList bg={"gray.dark"}>
                            <MenuItem bg={"gray.dark"} onClick={copyURL} >Cpoy Link</MenuItem>
                            
                        </MenuList>                         
                    </Portal>                
                </Menu>
            </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
            <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} color={"gray.light"} justifyContent={"center"} pb='3' cursor={"pointer"}>
             <Text fontWeight={"bold"}>Replies</Text>
        </Flex>


      </Flex>
      </VStack>
    );
};
export default UserHeader; 