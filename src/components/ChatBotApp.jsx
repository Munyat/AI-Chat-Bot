import { useEffect, useRef, useState } from "react";
import "./ChatBotApp.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const ChatBotApp = ({
  onGoBack,
  chats,
  setChats,
  activeChat,
  setActiveChat,
  onNewChat,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const activeChatObj = chats.find((chat) => chat.id === activeChat);
    setMessages(activeChatObj ? activeChatObj.messages : []);
  }, [activeChat, chats]);

  useEffect(() => {
    if (activeChat) {
      const storedMessages = JSON.parse(localStorage.getItem(activeChat)) || [];
      setMessages(storedMessages);
    }
  }, [activeChat]);

  const handleEmojiSelect = (emoji) => {
    setInputValue((prevInput) => prevInput + emoji.native);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();

    if (inputValue.trim() === "") return;
    setShowEmojiPicker((prev) => false);

    if (!activeChat) {
      onNewChat(inputValue);
      setInputValue("");
    } else {
      const newMessage = {
        type: "prompt",
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem(activeChat, JSON.stringify(updatedMessages));
      setInputValue("");

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });
      setChats(updatedChats);
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      setIsTyping(true);

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = inputValue;

      const result = await model.generateContent(prompt);
      console.log(result.response.text());

      const chatResponse = result.response.text();

      const newResponse = {
        type: "response",
        text: chatResponse,
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedMessagesWithResponse = [...updatedMessages, newResponse];
      setMessages(updatedMessagesWithResponse);
      localStorage.setItem(
        activeChat,
        JSON.stringify(updatedMessagesWithResponse)
      );
      setIsTyping(false);

      const updatedChatsWithResponse = chats.map((chat) => {
        if (chat.id === activeChat) {
          return { ...chat, messages: updatedMessagesWithResponse };
        }
        return chat;
      });
      setChats(updatedChatsWithResponse);
      localStorage.setItem("chats", JSON.stringify(updatedChatsWithResponse));
    }
  };

  const handleSelectChat = (id) => {
    setActiveChat(id);
  };

  const handleDeleteChat = (id) => {
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    localStorage.removeItem(id);

    if (id === activeChat) {
      const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChat(newActiveChat);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-app">
      <div className={`chat-list ${showChatList ? "show" : ""}`}>
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i
            className="bx bx-edit-alt new-chat"
            onClick={() => onNewChat("")}
          ></i>
          <i
            className="bx bx-x-circle close-list"
            onClick={() => setShowChatList(false)}
          ></i>
        </div>
        <div className="scroll">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-list-item ${chat.id === activeChat ? "active" : ""}`}
              onClick={() => {
                handleSelectChat(chat.id);
              }}
            >
              <h4>{chat.displayId}</h4>
              <i
                className="bx bx-x-circle"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-menu" onClick={() => setShowChatList(true)}></i>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>
        <div className="chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.type === "prompt" ? "prompt" : "response"}
            >
              {msg.text} <span>{msg.timestamp}</span>
            </div>
          ))}
          {isTyping && <div className="typing">Typing...</div>}
          <div ref={chatEndRef}></div>
        </div>
        <form className="msg-form" onSubmit={sendMessage}>
          <i
            className="fa-solid fa-face-smile emoji"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          ></i>
          {showEmojiPicker && (
            <div className="picker">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
          <input
            type="text"
            className="msg-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowEmojiPicker(false)}
          />
          <button type="submit" className="send-btn">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
