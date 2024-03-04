import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export default function FriendList(props) {

  const [friends, setFriends] = useState([])
  useEffect(() => {
    const GetFriends = async () => {
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
       response.data.length !== 0 ? setFriends(response.data) : setFriends(["No friends? :("])
    }
    GetFriends()
  },[])

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
      className="list-group list-group-flush p-2 h-100 overflow-auto custom-border"
    >
      <p className="text-center">Online</p>
      {listItems}
    </div>
  );
}