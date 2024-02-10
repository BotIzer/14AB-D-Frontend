import { Link } from "react-router-dom";

function MessageList(props) {
  const borderStyle = {
    borderTop: "2px solid #e8cc80",
  };
  const messages = props.messages.map((message) => {
    return (
      <div key={message.id} style={borderStyle}>
        <Link
          to={"/user/" + message.senderId}
          className="chat-name secondary"
        >
          {message.senderId}
        </Link>
        <p className="chat-text">{message.text}</p>
      </div>
    );
  });

  return <>{messages}</>;
}

export default MessageList;
