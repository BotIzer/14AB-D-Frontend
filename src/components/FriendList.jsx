import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function FriendList() {
  const friends = ["Marnkneu22", "BotIzer", "Lajtaib0801", "Placeholder1"];

  const listItems = friends.map((friend) => (
    <Link
      className="list-group-item secondary"
      to={"/user/" + friend}
      key={friend}
    >
      {friend}
    </Link>
  ));
  return (
    <div
      data-bs-theme="dark"
      className="list-group list-group-flush p-2 h-100 overflow-auto"
    >
      <p className="text-center">Online</p>
      {listItems}
    </div>
  );
}

export default FriendList;
