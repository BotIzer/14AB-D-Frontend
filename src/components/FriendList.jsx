import 'bootstrap/dist/css/bootstrap.min.css';

function FriendList()
{
  const friends = [
    'Marnkneu22',
    'BotIzer',
    'Lajtaib0801',
    'Placeholder1',
  ];

  const listStyle = {
    listStyle: 'none',
    color: 'yellow',
    backgroundColor: 'grey'
  }

  const listItems = friends.map(friend => <a className='list-group-item' href={"/friends/"+friend} key={friend}>{friend}</a>);
  return <div className='list-group list-group-flush' data-bs-theme='dark' style={listStyle}>{listItems}</div>
  
}

export default FriendList;