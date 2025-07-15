"use client";

import React from 'react'
import classes from './page.module.css';
import { useSocket } from '../context/SocketProvider';

const Home = () => {
  const  {sendMessage, messages} = useSocket();
  const [message, setMessage] = React.useState('');
  // console.log(messages);
  return (
    <div>
      <div>
        <input type="text" placeholder='type message' className={`${classes['chat-input']}`} value={message} onChange={e=> setMessage(e.target.value)} />
        <button className={classes['chat-button']} onClick={e => sendMessage(message)}>Send</button>
      </div>
      <div className='flex flex-col items-center justify-center w-full h-screen'>
      <div>
        <h1>All messages appear here</h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-6'>
          {
            messages.map((msg, index) => (
              <li key={index}
              className='list-none bg-gray-300 w-[200px] h-[40px] p-5 m-5 mb-4 rounded-md flex justify-center items-center'
              >{msg}</li>
            ))
          }
      </div>
      </div>
    </div>
  )
}

export default Home