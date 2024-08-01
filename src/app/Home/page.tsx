"use client";
import { useState, useEffect } from 'react';
import ImageSlider from '../Home/ImageSlider';
import MeetingControls from '../Home/MeetingControls';
import Link from 'next/link';
import {getCookie} from "cookies-next";


const email =getCookie("email");
const name =getCookie("firstname")|| "murali";
const phnumber=getCookie("phnumber");

const Home = () => {
  const [tooltipText, setTooltipText] = useState('');
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  const updateTime = () => {
    const now = new Date();
    const dateTimeString = now.toLocaleString();
    document.getElementById('date-time')!.innerText = dateTimeString;
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const showTooltip = (text: string) => {
    setTooltipText(text);
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    }
  };

  const hideTooltip = () => {
    setTooltipText('');
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }
  };

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);
  };

  return (
    <div className="font-sans min-h-screen">
      <header className="flex justify-between items-center bg-white p-4 border-b">
        <div className="flex items-center">
          <div className="text-2xl font-bold">Streamlingo</div>
        </div>
        <div className="flex items-center space-x-4">
          <div id="date-time"></div>
          <a href="/about" className="text-gray-800 hover:underline">About</a>
          <div
            className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded"
            onMouseOver={() => showTooltip('Support')}
            onMouseOut={hideTooltip}
          >
            <span className="text-xl">?</span>
          </div>
          <div
            className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded"
            onMouseOver={() => showTooltip('Report a Problem')}
            onMouseOut={hideTooltip}
          >
            <span className="text-xl">!</span>
          </div>
          <div
            className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded cursor-pointer"
            onClick={toggleToolbar}
            onMouseOver={() => showTooltip('Profile')}
            onMouseOut={hideTooltip}
          >
            <span className="text-xl">👤</span>
          </div>
          <div id="tooltip" className="tooltip absolute bg-black text-white px-2 py-1 rounded opacity-0 transition-opacity duration-500">{tooltipText}</div>
        </div>
      </header>
      <main className="flex justify-between p-8">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold pt-300 pb-300">Video Calls and Meetings for Everyone</h1>
          <p className="text-xl text-gray-600 mt-4 pt-200 pb-300">Streamlingo provides seamless and high-quality video calls for all your meeting needs.</p>
          <MeetingControls />
        </div>
        <div className="w-1/2 flex flex-col items-center">
          <ImageSlider />
        </div>
      </main>
      {isToolbarVisible && (
        <div className="fixed right-0 top-0 w-64 bg-white border-l shadow-lg p-4">
          <div className="text-lg font-semibold">Profile</div>
          <div className="mt-2">
            <div className="text-gray-800">Username: <span className="font-medium">{name}</span></div>
            <div className="text-gray-800">Email: <span className="font-medium">{email}</span></div>
            <div className="text-gray-800">Phone: <span className="font-medium">{phnumber}</span></div>
            <a href="/settings" className="block mt-2 text-blue-600 hover:underline">Settings</a>
            <Link href="/Logout" className="block mt-2 text-red-600 hover:underline">Logout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
