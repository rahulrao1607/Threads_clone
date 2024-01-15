import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom"
import Actions from "./Actions";
import { useState } from "react";

 
const UserPost = ({postImg1,postTitle1,likes1,replies1}) => {
    const [liked,setLiked] =useState(false);
  return (
    <Link to={"/markzukerberg/post/1"}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name="Markzuckbeg" src="/zuck-avatar.png"/>
                <Box w='1px' h={"full"} bg={'gray.dark'} my={2}></Box>
                <Box position={"relative"} w={"full"}>
                    <Avatar
                     size="xs"
                      name="Jhon"
                       src="https://bit.ly/dan-abramov" 
                       position={"absolute"} 
                       top={"0px"} 
                       left={"13px"} 
                       padding={"2px"}
                       />
                    <Avatar 
                    size="xs" 
                    name="Jhon" 
                    src="https://bit.ly/kent-c-dodds" 
                    position={"absolute"}
                    bottom={"0px"} 
                    right={"-5px"} 
                    padding={"2px"}
                    />
                    <Avatar 
                    size="xs" 
                    name="Jhon" 
                    src="https://bit.ly/prosper-baba" 
                    position={"absolute"} 
                    bottom={"0px"} 
                    left={"4px"} 
                    padding={"2px"}
                    />
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"centre"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>markzukuberg</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots />
                    </Flex>
                </Flex>
                <Text fontSize={"sm"}>{postTitle1}</Text>
                {postImg1 && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={postImg1} w={"full"} />
                </Box>
                )}  
                  
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>{replies1} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                    <Text color={"gray.light"} fontSize={"sm"}>{likes1} likes</Text>
                </Flex>                            
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost;