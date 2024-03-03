import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "../api/axios";

export default function FriendMenu() {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
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
    const AddToChat = async () =>{
        await axios.post(
          '/chat/addFriend',
          {
            friendName: friend,
            chat_id: 0, //I dont know if this change is needed, this field was left without value and project couldnt start because of it
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
    onClick={AddToChat}>
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