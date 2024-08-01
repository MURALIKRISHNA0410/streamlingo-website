"use client";
import { useRef, useEffect, useState } from 'react';

const MeetingPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const handleVideoToggle = () => {
    const stream = videoRef.current!.srcObject as MediaStream;
    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach(track => track.enabled = !track.enabled);
  };

  const handleMuteToggle = () => {
    const stream = videoRef.current!.srcObject as MediaStream;
    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach(track => track.enabled = !track.enabled);
  };

  const handleEndCall = () => {
    const stream = videoRef.current!.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    window.location.href = '/Home'; // Redirect to the home page
  };

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (message !== '') {
      const chatMessages = document.getElementById('chat-messages');
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      chatMessages!.appendChild(messageElement);
      setInputValue('');
      chatMessages!.scrollTop = chatMessages!.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white-900 text-black">
      <header className="flex items-center justify-between bg-white-800 p-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">Streamlingo</span>
        </div>
      </header>
      <div className="flex flex-grow">
        <div className="flex-1 bg-black flex justify-center items-center">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-4xl rounded"></video>
        </div>
        <div className="w-96 flex flex-col bg-white-800 p-4">
          <div id="chat-messages" className="flex-grow overflow-y-auto border border-black-700 p-2 mb-2 rounded"></div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-700 rounded bg-white-700 text-black"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="bg-black-500 text-black px-4 py-2 rounded"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-white-800 p-4 flex justify-between items-center mt-auto space-x-2">
        <button className="flex items-center space-x-4" onClick={openParticipantsModal}>
          <i className="fas fa-user-plus"></i>
          <span>Add Participants</span>
        </button>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 bg-slate-600 hover:bg-blue-400" onClick={handleMuteToggle}>
            <i className="fas fa-microphone-slash"></i>
            <span>Unmute</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-600 hover:bg-blue-400" onClick={handleVideoToggle}>
            <i className="fas fa-video-slash"></i>
            <span>Start Video</span>
          </button>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleEndCall}>
          <i className="fas fa-phone-slash"></i>
          <span>End Call</span>
        </button>
      </footer>
      <div id="participants-modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded">
          <button className="text-black self-end" onClick={closeParticipantsModal}>&times;</button>
          <h2 className="text-black text-lg mb-2">Invite Participants</h2>
          <p className="text-black mb-2">Copy the meeting link and share it via email.</p>
          <div className="flex items-center mb-2">
            <input type="text" id="meeting-link" value="https://your-meeting-link.com" readOnly className="flex-grow p-2 border border-gray-700 rounded" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2" onClick={copyMeetingLink}>Copy Link</button>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={shareViaEmail}>Share via Email</button>
        </div>
      </div>
    </div>
  );
};

const openParticipantsModal = () => {
  document.getElementById('participants-modal')!.classList.remove('hidden');
};

const closeParticipantsModal = () => {
  document.getElementById('participants-modal')!.classList.add('hidden');
};

const copyMeetingLink = () => {
  const link = document.getElementById('meeting-link') as HTMLInputElement;
  link.select();
  link.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand('copy');
  alert('Meeting link copied to clipboard');
};

const shareViaEmail = () => {
  const link = (document.getElementById('meeting-link') as HTMLInputElement).value;
  window.location.href = `mailto:?subject=Join my meeting&body=Join my meeting: ${link}`;
};

export default MeetingPage;
