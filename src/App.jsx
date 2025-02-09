import { useState } from "react";
import ChatBotApp from "./components/ChatBotApp";
import ChatBotStart from "./components/ChatBotStart";

function App() {
  const [isChatting, setIsChatting] = useState(false);

  function handleIsChatting() {
    setIsChatting(!isChatting);
  }

  return (
    <div className="container">
      {isChatting ? (
        <ChatBotApp onGoBack={handleIsChatting} />
      ) : (
        <ChatBotStart onStartChat={handleIsChatting} />
      )}
    </div>
  );
}

export default App;
