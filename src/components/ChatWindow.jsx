import { useState } from "react";
import MessageList from "./chat-components/MessageList";


function ChatWindow() {
    const DUMMY_DATA = [
        {
          id: 0,
          senderId: "perborgen",
          text: "who'll win?"
        },
        {
          id: 1,
          senderId: "janedoe",
          text: "who'll win?"
        }
      ]



    const [messages, setMessages] = useState(DUMMY_DATA);

    return (        
        <div>
            <MessageList messages={messages}></MessageList>
        </div>
    )
}

export default ChatWindow;