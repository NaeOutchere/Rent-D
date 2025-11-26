import React, { useState, useEffect } from "react";
import { CgMenu } from "react-icons/cg";
import { BsSearch } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdOutlineWbSunny } from "react-icons/md";
import { CiCloudMoon } from "react-icons/ci";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import avatar from "../data/Denae.png";
import { Chat, Notifications, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { Messages } from "../pages";
import MessagesDropdown from "./MessagesDropdown"; // Add this import
import NotificationsDropdown from "./NotificationsDropdown"; // Add this import

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
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
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentMode,
    setMode,
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

  // Toggle dark/light mode
  const toggleMode = () => {
    setMode(currentMode === "Light" ? "Dark" : "Light");
  };

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="#e07229"
        icon={<CgMenu />}
      />

      <div className="flex ">
        {/* Mode Toggle Button */}
        <NavButton
          title={currentMode === "Light" ? "Dark Mode" : "Light Mode"}
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
