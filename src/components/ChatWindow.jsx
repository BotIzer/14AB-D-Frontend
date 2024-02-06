import { useState } from "react";
import MessageList from "./chat-components/MessageList";
import { Form, FormGroup, Button } from "react-bootstrap";

function ChatWindow() {
  const DUMMY_DATA = [
    {
      senderId: "Sukuna",
      text: "Ryouiki tenkai",
    },
    {
      senderId: "Gojo Satoru",
      text: "Nah I'd win",
    },
    {
      senderId: "Yoshikage Kira",
      text: "My name is Yoshikage Kira. I’m 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don’t smoke, but I occasionally drink. I’m in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I’m trying to explain that I’m a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn’t lose to anyone.",
    },
  ];

  const [messages, setMessages] = useState(DUMMY_DATA);

  return (
    <div className="m-5 p-2 h-50 border overflow-auto">
      <MessageList messages={messages}></MessageList>
      <FormGroup controlId="sendMsg">
        <div className="row m-0">
          <Form.Control
            placeholder="Send message"
            className="w-75"
            autoFocus
          ></Form.Control>
          <Button
            variant="outline-warning"
            className="custom-button m-0 w-25"
            type="submit"
          >
            Send
          </Button>
        </div>
      </FormGroup>
    </div>
  );
}

export default ChatWindow;
