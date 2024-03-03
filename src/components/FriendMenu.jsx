import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "../api/axios";

export default function FriendMenu(props) {
    const [friends, setFriends] = useState([]);
    const [chat, setChat] = useState(null);
    useEffect(() => {
      setChat(props.chat);
        async function GetFriends() {
            try {
                const response = await axios.get('/friends', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true,
                }
                );
                response.data.length !== 0 ? setFriends(response.data) : setFriends(["No friends? :("])
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
            
        }
        
        GetFriends();
    }, []);
    const AddToChat = async (friend) =>{
        await axios.post(
          '/chat/addFriend',
          {
            friendName: friend,
            chat_id: props.chat,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
      }
      const listItems = friends.map((friend) => (
        <Button
            key={friend}
            onClick={() => AddToChat(friend)}>
            {friend}
        </Button>
    ));
  return (
    <div
      data-bs-theme="dark"
      className="list-group list-group-flush p-2 h-100 overflow-auto custom-border"
    >
      <p className="text-center">Online</p>
      {console.log(friends)}
      {listItems}
    </div>
  );
}