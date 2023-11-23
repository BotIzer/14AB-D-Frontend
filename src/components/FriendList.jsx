import 'bootstrap/dist/css/bootstrap.min.css';

function FriendList()
{
  const friends = [
    'Marnkneu22',
    'BotIzer',
    'Lajtaib0802',
    'Placeholder1',
  ];

  const listStyle = {
    listStyle: 'none',
    color: 'yellow',
    backgroundColor: 'grey'
  }

  const listItems = friends.map(friend => <div className='row list-group-item justify-content-md-center'><a href="/friends/{id}">{friend}</a></div>);
  return <div className='container col-md-4 '>
      <div className='list-group' data-bs-theme='dark' style={listStyle}>{listItems}</div>
  </div>
  
}

export default FriendList;