
function MessageList(props) {
    // // const messages = props.messages.map(message => {
    // //     <li key={message.id}>
    // //         <div>{message.senderId}</div>
    // //         <div>{message.text}</div>
    // //     </li>
    // // })

    return <ul>
        {messages}
    </ul>
}

export default MessageList;