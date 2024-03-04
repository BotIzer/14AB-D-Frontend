import { Button } from "react-bootstrap";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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
  return (
    <div data-bs-theme="dark" className="border list-group list-group-flush h-100">
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
    </div>
  );
}

export default FriendPopupActions;
