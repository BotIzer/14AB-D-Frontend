import { Button } from "react-bootstrap";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";

function FriendPopupActions(props) {
  const isOwner = true; //TODO check if current user is the owner or not
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
  const DeleteChat = async () => {
    await axios.delete(
      `/chat/${props.selectedChat}`,
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
    <div data-bs-theme="dark" className="list-group list-group-flush h-100">
      <p className="list-group-item secondary w-100 p-2 text-center mb-0" style={{borderBottom: "1px solid #e8cc80"}}>{props.name}</p>
      {props.type == 'friend' ?
        
      <React.Fragment>
      <Button
      className="border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button"
      key={"Profile"}
      onClick={()=> GoToProfile()}
    >
      Profile
    </Button>
    <Button
      className="border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button"
      key="RemoveFriend"
      onClick={()=> RemoveFriend()}
    >
      Remove Friend
    </Button>
    </React.Fragment>
    :
    <React.Fragment>
      <Button
      className="border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button"
      key={"Profile"}
      onClick={()=> ListMembers()}
    >
      See members
    </Button>
    <Button
      className="border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button"
      key="RemoveFriend"
      onClick={()=> LeaveChat()}
    >
      Leave Chat
    </Button>
    {isOwner? <Button
      className="border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button"
      key="RemoveFriend"
      onClick={()=> DeleteChat()}
    >
      Delete Chat
    </Button> : null}
    </React.Fragment>
    }
    </div>
  );
}

export default FriendPopupActions;
