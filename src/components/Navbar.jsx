import React, {useState, useEffect} from 'react';
import {CgMenu} from 'react-icons/cg';
import {BsSearch} from 'react-icons/bs';
import {TiMessages} from 'react-icons/ti';
import {IoNotificationsOutline} from 'react-icons/io5';
import { MdKeyboardArrowDown, MdOutlineWbSunny } from 'react-icons/md';
import {CiCloudMoon} from 'react-icons/ci';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../data/Denae.png';
import { Chat, Notifications, UserProfile} from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { Messages } from '../pages';

const NavButton = ({ title, customFunc, icon, color, dotColor}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button 
    type='button' 
    onClick={customFunc} 
    style={{color}}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span style={{background:dotColor}} className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
        {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick, screenSize, setScreenSize} = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if(screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize])
  

  return (
    <div className='flex justify-between p-2 md:mx-6 relative'>
      <NavButton 
      title="Menu" 
      customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} 
      color="#e07229" 
      icon={<CgMenu />}/>

      <div className='flex '>
        <NavButton 
      title="Mode" 
      customFunc={() => handleClick('mode')} 
      color="#e07229" 
      icon={<CiCloudMoon />}/>

        <NavButton 
      title="Messages" 
      dotColor="#274254"
      customFunc={() => handleClick('messages')} 
      color="#e07229" 
      icon={<TiMessages />}/>

        <NavButton 
      title="Notifications" 
      dotColor="#274254"
      customFunc={() => handleClick('notifications')} 
      color="#e07229" 
      icon={<IoNotificationsOutline />}/>

      <TooltipComponent content="profile" position="BottomCenter">
        <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg' onClick={() => handleClick('userProfile')}>
          <img className='rounded-full w-8 h-8' src={avatar}/>
          <p>
            <span className='text-gray-400 text-14'>Hi, </span> {' '}
            <span className='text-gray-400 font-bold ml-1 text-14'>Denaé</span>
          </p>
          <MdKeyboardArrowDown 
          className='text-gray-400 text-14'
          />
        </div>
      </TooltipComponent>
{/* 
      {isClicked.mode && <Mode />} */}
      {isClicked.messages && <Messages />}
      {isClicked.notifications && <Notifications />}
      {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  )
}

export default Navbar