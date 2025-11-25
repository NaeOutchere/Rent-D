import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import { RiBuilding2Fill } from 'react-icons/ri';
// import { FiSettings } from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {

  const { activeMenu, setActiveMenu, screenSize} = useStateContext();

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    };
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-25rounded-lg text-main-orange text-md m-2';

  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-25rounded-lg  text-md text-gray-700 dark:ext-gray-200 dark:hover:text-black hover:bg-light-gray m-2';


  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (<>
      <div className='flex justify-between items-center'>
        <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-main-orange">
          <RiBuilding2Fill /> <span>Rent'D</span>
        </Link>
        <TooltipComponent content="Close" position='BottomCenter'>
          <button 
          type='button' 
          onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
          className="text-xl rounded-full p-3 hover:bg-lightgray mt-4 block">
            <AiOutlineClose />
          </button>
        </TooltipComponent>
      </div>
      <div className='mt-10'>
        {links.map((item) => (
          <div key={item.title}>
            <p className='text-gray-400 m-3 mt-4 uppercase'>    
              {item.title}
            </p>
            {item.links.map((link)=> (
              <NavLink to={`/${link.name}`}
              key={link.name}
              onClick={handleCloseSideBar}
              className={({ isActive}) => isActive ? activeLink : normalLink }
              >
                {link.icon}
                <span className='capitalize'>
                  {link.name}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      </>)}
    </div>
  )
}

export default Sidebar