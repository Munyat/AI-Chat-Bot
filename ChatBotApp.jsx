// import { useEffect, useState } from "react";
// import "./ChatBotApp.css";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// function ChatBotApp({
//   onGoBack,
//   chats,
//   setChats,
//   activeChat,
//   setActiveChat,
//   onNewChat,
// }) {
//   const [inputValue, setInputValue] = useState("");
//   const [messages, setMessages] = useState(chats[0]?.messages || []);

//   useEffect(() => {
//     const activeChatObj = chats.find((chat) => chat.id === activeChat);
//     setMessages(activeChatObj?.messages || []);
//   }, [activeChat, chats]);

//   function handleInputChange(e) {
//     setInputValue(e.target.value);
//   }

//   async function sendMessage(e) {
//     if (e) e.preventDefault(); // Prevent form submission

//     if (inputValue.trim() === "") return;

//     const newMessage = {
//       type: "prompt",
//       text: inputValue,
//       timestamp: new Date().toLocaleTimeString(),
//     };

//     if (!activeChat) {
//       onNewChat(inputValue);
//       setInputValue("");
//     } else {
//       // setChats((prevChats) =>
//       //   prevChats.map((chat) =>
//       //     chat.id === activeChat
//       //       ? { ...chat, messages: [...chat.messages, newMessage] }
//       //       : chat
//       //   )
//       // );
//       const updatedMessages = [...messages, newMessage];
//       setMessages(updatedMessages);
//       setInputValue("");

//       const genAI = new GoogleGenerativeAI(
//         "AIzaSyAJCWeOcLFR41BYJsXPYwV1NSom3LfQXKQ"
//       );
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = inputValue;

//       const result = await model.generateContent(prompt);
//       console.log(result.response.text());

//       const chatResponse = result.response.text();

//       const newResponse = {
//         type: "response",
//         text: chatResponse,
//         timestamp: new Date.toLocaleTimeString(),
//       };
//       const updatedMessageswithResponse = [...updatedMessages, newResponse];
//       setMessages(updatedMessageswithResponse);

//       const updatedChatsWithResponse = chats.map((chat) => {
//         if (chat.id === activeChat) {
//           return { ...chat, messages: updatedMessageswithResponse };
//         }
//         return chat;
//       });
//       setChats(updatedChatsWithResponse);
//     }
//   }

//   function handleSelectChat(id) {
//     setActiveChat(id);
//   }

//   function handleDeleteChat(id) {
//     const updatedChats = chats.filter((chat) => chat.id !== id);
//     setChats(updatedChats);
//     if (id === activeChat) {
//       const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;
//       setActiveChat(newActiveChat);
//     }
//   }

//   return (
//     <div className="chat-app">
//       <div className="chat-list">
//         <div className="chat-list-header">
//           <h2>Chat List</h2>
//           <i
//             className="bx bx-edit-alt new-chat"
//             onClick={() => onNewChat()}
//           ></i>
//         </div>
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             className={`chat-list-item ${chat.id === activeChat ? "active" : ""}`}
//             onClick={() => handleSelectChat(chat.id)}
//           >
//             <h4>{chat.displayId}</h4>
//             <i
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDeleteChat(chat.id);
//               }}
//               className="bx bx-x-circle"
//             ></i>
//           </div>
//         ))}
//       </div>
//       <div className="chat-window">
//         <div className="chat-title">
//           <h3>Chat with AI</h3>
//           <i onClick={onGoBack} className="bx bx-arrow-back arrow"></i>
//         </div>
//         <div className="chat">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={msg.type === "prompt" ? "prompt" : "response"}
//             >
//               <p>{msg.text}</p>
//               <span>{msg.timestamp}</span>
//             </div>
//           ))}
//           <div className="typing">Typing...</div>
//         </div>
//         <form className="msg-form" onSubmit={sendMessage}>
//           <i className="fa-solid fa-face-smile emoji"></i>
//           <input
//             type="text"
//             className="msg-input"
//             placeholder="Type a message..."
//             value={inputValue}
//             onChange={handleInputChange}
//           />
//           <button type="submit" className="send-btn">
//             <i className="fa-solid fa-paper-plane"></i>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ChatBotApp;
