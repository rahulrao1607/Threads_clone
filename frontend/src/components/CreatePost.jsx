import { AddIcon } from "@chakra-ui/icons"
import { Button, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useColorModeValue ,useDisclosure, Text ,Input, Flex, CloseButton ,Image } from "@chakra-ui/react"
import { useRef,useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";


const max_char=240;

    const CreatePost = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        const [postText, setPostText] = useState("");
        const {handleImageChange ,imgUrl, setImgUrl} = usePreviewImg();
        const imageRef = useRef(null);
        const [remainingChar , setRemainingChar] = useState(max_char);
        const user = useRecoilValue(userAtom);
        const [loading,setLoading] = useState(false);
        const showToast = useShowToast();
        const [posts, setPosts] = useRecoilState(postsAtom);
        const {username} = useParams();


        const handleTextChange = (e) =>{

            const inputText = e.target.value;
            if(inputText.length > max_char)
            {
                const truncatedText =inputText.slice(0,max_char);
                setPostText(truncatedText);
                setRemainingChar(0);
            }
            else{
                setPostText(inputText);
                setRemainingChar(max_char-inputText.length);
            }
        };

        const handleCreatePost = async() =>{

            setLoading(true);
            try {

                const res= await fetch("/api/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postedBy: user._id,
                        text: postText,
                        img: imgUrl}),
                });               
                const data = await res.json();
                    if(data.error)
                    {
                        showToast("Error",data.error,"error");
                        return;
                    }
                    showToast("Sucess","Post Created Sucessfully","success");
                    if(username === user.username)
                    {
                        setPosts([data, ...posts]);
                    }
                    
                    onClose();
                    setPostText("");
                    setImgUrl("");

                
            } catch (error) {

                showToast("Error","error","error");           
            } finally{
                setLoading(false);
            }           
        };
        
    return (
    <>
    <Button 
         position={"fixed"} 
         bottom={10} 
         right={5}  
         bg={useColorModeValue("gray.300","gray.dark")}
         onClick={onOpen}
         size={{base:"sm" , sm:"md"}}
    >
        <AddIcon />
    </Button>
      <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader> Create Post </ModalHeader>
            <ModalCloseButton/>
            <ModalBody pb={6}>

                <FormControl>
                    <Textarea placeholder='Post Content Goes here....'
                              onChange={handleTextChange}
                              value={postText}
                    />
                    <Text fontSize="xs" fontWeight="bold" textAlign="right" m={"1"} color="gray.400">
                        {remainingChar}/{max_char}
                    </Text>
                    <Input
                       type="file"
                       hidden
                       ref={imageRef}
                       onChange={handleImageChange}
                    />
                    <BsFillImageFill 
                       style={{marginLeft:"5px",cursor:"pointer"}}
                       size={16}
                       onClick={()=>imageRef.current.click()}
                    />

                </FormControl>

                {imgUrl && (
                    <Flex mt={5} w={"full"} position={"relative"}>
                        <Image src={imgUrl} alt='selected image' />
                        <CloseButton 
                           onClick={() =>{
                                setImgUrl("");
                           }}
                           bg={"gray.800"}
                           position={"absolute"}
                           top={2}
                           right={2}                      
                        />
                    </Flex>
                )}
            </ModalBody>
            <ModalFooter>
             <Button colorScheme='blue' mr={3} onClick={handleCreatePost}
             isLoading={loading}>{/* handleCreatePost */}
              Post
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onClose}> Close </Button>
            </ModalFooter>
        </ModalContent>

      </Modal>
    

    </>
    )
    }

    export default CreatePost;