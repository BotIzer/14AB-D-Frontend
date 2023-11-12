import { useState } from 'react'
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Navigation from './components/Navigation'
import FriendList from './components/FriendList'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navigation/>
    <FriendList/>
    </>
  )
}

export default App
