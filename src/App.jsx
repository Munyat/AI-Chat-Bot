import { useState } from "react";
import ChatBotApp from "./components/ChatBotApp";
import ChatBotStart from "./components/ChatBotStart";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);

  function handleStartChatting() {
    setIsChatting(true);

    if (chats.length === 0) {
      createNewChat();
    }
  }
  function handleGoBack() {
    setIsChatting(false);
  }

  function createNewChat(initialMessage = "") {
    const newChat = {
      id: uuidv4(),
      displayId: `Chat ${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString()}`,
      messages: initialMessage
        ? [
            {
              type: "prompt",
              text: initialMessage,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]
        : [],
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChat(newChat.id);
  }

  return (
    <div className="container">
      {isChatting ? (
        <ChatBotApp
          onGoBack={handleGoBack}
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onNewChat={createNewChat}
        />
      ) : (
        <ChatBotStart onStartChat={handleStartChatting} />
      )}
    </div>
  );
}

export default App;
