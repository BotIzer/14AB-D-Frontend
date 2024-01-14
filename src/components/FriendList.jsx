import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function FriendList()
{
  const friends = [
    'Marnkneu22',
    'BotIzer',
    'Lajtaib0801',
    'Placeholder1',
  ];

  const listItems = friends.map(friend => <Link className='list-group-item primary' to={"/friends/"+friend} key={friend}>{friend}</Link>);
  return <div data-bs-theme='dark' className='list-group list-group-flush'>{listItems}</div>
  
}

export default FriendList;