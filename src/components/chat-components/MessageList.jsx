import { Link } from 'react-router-dom'

function MessageList(props) {
  const borderStyle = {
    borderTop: '2px solid #e8cc80',
  }
  const messages = props.messages.map((message) => {
    return (
      <div className='p-2 w-100' key={message._id.message_id} style={borderStyle}>
        <Link to={'/user/' + message.creator_name} className="chat-name secondary">
          {message.creator_name}
        </Link>
        <p className="chat-text">{message.text}</p>
      </div>
    )
  })

  return <>{messages}</>
}

export default MessageList
