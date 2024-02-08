import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function FriendList(props) {
  const listItems = props.friends.map((friend) => (
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