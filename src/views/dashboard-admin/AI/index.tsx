import {
    ChatContainer,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    TypingIndicator,
    Avatar
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Grid } from '@mui/material';
import { useState } from 'react';
import logo from '../../../assets/logoGDVN.png'

const API_KEY = "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"

export default function AIBOX() {
    const [msg, setMsg] = useState("");

    const [messages, setMessages] = useState<any>([
        {
            message: "Xin chào, tôi là AI GDVN! Đang lắng nghe bạn!",
            sentTime: "just now",
            sender: "AI GDVN",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendRequest = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user",
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsTyping(true);

        try {
            const response = await processMessageToChatGPT([...messages, newMessage]);
            const content = response.choices[0]?.message?.content;
            if (content) {
                const chatGPTResponse = {
                    message: content,
                    sender: "AI GDVN",
                };
                setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    async function processMessageToChatGPT(chatMessages) {
        const apiMessages = chatMessages.map((messageObject) => {
            const role = messageObject.sender === "AI GDVN" ? "assistant" : "user";
            return { role, content: messageObject.message };
        });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                { role: "system", content: "I'm a Student using AI GDVN for learning" },
                ...apiMessages,
            ],
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiRequestBody),
        });

        return response.json();
    }

    return (
        <Grid container xs={12}>
            {/* <Grid style={{ position: "relative", height: "780px", width: "700px"}}> */}
            <Grid item xs={12} md={12} height='680px'>
                <MainContainer responsive>
                    <ChatContainer >
                        <MessageList
                            scrollBehavior="smooth"
                            color='red'
                            typingIndicator={isTyping ? <TypingIndicator content="AI GDVN đang trả lời" /> : null}
                        >
                            {messages.map((message, i) => {
                                return <Message key={i} model={message} >
                                    {message.sender === "AI GDVN"
                                        ?
                                        <Avatar src={logo} name="GD" />
                                        :
                                        <Avatar src='https://uploads.codesandbox.io/uploads/user/08ea94b1-c4e3-43bf-9a9c-890e333103e4/DIJh-ram.png' name="USER" />
                                        // <>
                                        //     {item?.imageUser !== null || item?.imageUser !== 'default_image.jpg' ?
                                        //         <>
                                        //             {item?.gender === '0' ?
                                        //                 <img width='80px' src={logoNam} alt="ảnh thành viên" />
                                        //                 :
                                        //                 <img width='80px' src={logoNu} alt="ảnh thành viên" />
                                        //             }
                                        //         </>
                                        //         :
                                        //         // <img src='https://tiemanhsky.com/wp-content/uploads/2020/03/61103071_2361422507447925_6222318223514140672_n_1.jpg' width='80px' />
                                        //         <img width='80px' src={`${process.env.REACT_APP_BASE_API_URL}/${item?.imageUser}`} alt="ảnh thành viên" />
                                        //     }
                                        // </>
                                    }
                                </Message>
                            })}
                        </MessageList>
                        <MessageInput placeholder="Soạn tin nhắn" onSend={handleSendRequest} />
                    </ChatContainer>
                </MainContainer>
            </Grid>
        </Grid>
    )
}