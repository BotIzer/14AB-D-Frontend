import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export default function FriendList() {

  const [friends, setFriends] = useState([])
  addEventListener("storage", () => {
    setFriends([])
  })
  useEffect(() => {
    const GetFriends = async () => {
      // temporary fix to homepage
      if (localStorage.getItem('token') === null) {
        return
      }
      const response = await axios.get(
        '/friends',
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
       response.data.length !== 0 ? setFriends(response.data.returnFriends) : setFriends(["No friends? :("])
    }
    GetFriends()
  },[])
  const listItems = friends.map((friend) => (
    <Link
      className="list-group-item secondary"
      to={`/user/${friend.username}`}
      key={friend}
    >
      {friend.username}
    </Link>
  ));
  return (
    <div
      data-bs-theme="dark"
      className="list-group list-group-flush p-2 h-100 overflow-auto custom-border"
    >
      <p className="text-center">Online</p>
      {listItems}
    </div>
  );
}