"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MeetingControls = () => {
  const [inputValue, setInputValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('MeetingControls rendered');
    checkInput();
  }, [inputValue]);

  const checkInput = () => {
    const joinButton = document.getElementById('join-meeting-btn') as HTMLButtonElement | null;
    if (joinButton) {
      if (inputValue.trim() !== '') {
        joinButton.disabled = false;
        joinButton.classList.add('active');
      } else {
        joinButton.disabled = true;
        joinButton.classList.remove('active');
      }
    }
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const handleInstantMeeting = () => {
      router.push('/Meeting/page.tsx');
  };
  return (
    <div className="flex justify-center h-screen">
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold mb-2 justify-center py-10 px-20"></h1>
        <p className="text-lg text-gray-700 mb-4"></p>
        <div className="flex items-center justify-center space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            id="new-meeting-btn"
            onClick={toggleOptions}
          >
            New Meeting
          </button>
          <input
            type="text"
            className="p-2 border rounded w-48"
            placeholder="Paste URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-white text-black px-4 py-2 rounded disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-gray-200"
            id="join-meeting-btn"
            disabled
          >
            Join
          </button>
        </div>
        {showOptions && (
          <div id="meeting-options" className="mt-4 space-y-2">
            <Link href="/Meeting">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-200">+ Instant Meeting</button></Link>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-200">Create a Meet for Later</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-200">Schedule in Calendar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingControls;

