import "./ChatBotStart.css";

function ChatBotStart({ onStartChat }) {
  return (
    <div className="start-page-btn">
      <button className="start-page-btn" onClick={() => onStartChat()}>
        Start Chat{" "}
      </button>
    </div>
  );
}

export default ChatBotStart;
