import { Button } from "react-bootstrap";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";

function FriendPopupActions(props) {
  const navigate = useNavigate();
  const RemoveFriend = async () =>{
    await axios.delete(
      `/friend/${props.friend}`,
      {
        friendName: props.friend,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    )
  }
  const GoToProfile = async () => {
    navigate(`/user/${props.friend}`)
  }
  const ListMembers = async () =>{

  }
  const LeaveChat = async () =>{
    console.log(props.selectedChat);
    await axios.post(
      '/chat/leaveChat',
      {
        chat_id: props.selectedChat
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    )
  }
  return (
    <div data-bs-theme="dark" className="border list-group list-group-flush h-100">
      {/* TODO: make it be in the middle */}
      <p className="list-group-item secondary w-100 p-2 text-center">{props.name}</p>
      {props.type == 'friend' ?
        
      <React.Fragment>
      <Button
      className="list-group-item secondary h-100 w-100 p-2 custom-button"
      key={"Profile"}
      onClick={()=> GoToProfile()}
    >
      Profile
    </Button>
    <Button
      className="list-group-item secondary h-100 w-100 p-2 custom-button"
      key="RemoveFriend"
      onClick={()=> RemoveFriend()}
    >
      Remove Friend
    </Button>
    </React.Fragment>
    :
    <React.Fragment>
      <Button
      className="list-group-item secondary h-100 w-100 p-2 custom-button"
      key={"Profile"}
      onClick={()=> ListMembers()}
    >
      See members
    </Button>
    <Button
      className="list-group-item secondary h-100 w-100 p-2 custom-button"
      key="RemoveFriend"
      onClick={()=> LeaveChat()}
    >
      Leave Chat
    </Button>
    </React.Fragment>
    }
    </div>
  );
}

export default FriendPopupActions;
