import { Link } from 'react-router-dom'

function MessageList(props) {
  const borderStyle = {
    borderTop: '2px solid #e8cc80',
  }
  const messages = props.messages.map((message) => {
    return (
      <div key={message._id.message_id} style={borderStyle}>
        <Link to={'/user/' + message._id.creator_id} className="chat-name secondary">
          {message._id.creator_id}
        </Link>
        <p className="chat-text">{message.text}</p>
      </div>
    )
  })

  return <>{messages}</>
}

export default MessageList
