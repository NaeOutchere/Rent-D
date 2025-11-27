// In your Navbar.jsx, update the Mode button section:
import React, { useState, useEffect } from "react";
import { CgMenu } from "react-icons/cg";
import { TiMessages } from "react-icons/ti";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { CiCloudMoon } from "react-icons/ci";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import avatar from "../data/Denae.png";
import { UserProfile, MessagesDropdown, NotificationsDropdown } from "."; // Make sure these are imported
import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray dark:hover:bg-gray-600 transition duration-200"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    setScreenSize,
    currentMode,
    toggleMode,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="#e07229"
        icon={<CgMenu />}
      />

      <div className="flex">
        {/* Mode Toggle Button */}
        <NavButton
          title={
            currentMode === "Light"
              ? "Switch to Dark Mode"
              : "Switch to Light Mode"
          }
          customFunc={toggleMode}
          color="#e07229"
          icon={
            currentMode === "Light" ? <CiCloudMoon /> : <MdOutlineWbSunny />
          }
        />

        {/* Messages Dropdown */}
        <MessagesDropdown />

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Profile Dropdown */}
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
