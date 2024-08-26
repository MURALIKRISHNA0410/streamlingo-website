"use client";
import { useRef, useState, useEffect } from "react";

export default function WebrtcRoom() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [audioSocket, setAudioSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const servers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  const handleStart = async () => {
    // Get local media stream (audio + video)
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // Set the local video stream
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    // Open WebSocket connection for signaling
    const socket = new WebSocket("ws://localhost:8000/meetws");
    setSocket(socket);

    // Open WebSocket connection for audio processing
    const audioSocket = new WebSocket("ws://localhost:8000/process_audio");
    setAudioSocket(audioSocket);

    audioSocket.onopen = () => {
      const audioContext = new AudioContext();
      const mediaRecorder = new MediaRecorder(localStream);

      mediaRecorder.ondataavailable = async (event) => {
        const audioData = event.data;
        audioSocket.send(audioData);
      };

      mediaRecorder.start(1000); // Send audio data every second

      audioSocket.onmessage = async (event) => {
        const processedAudioData = event.data;

        // Create an audio element to play the processed audio
        const audioBlob = new Blob([processedAudioData], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        const source = audioContext.createMediaElementSource(audio);
        const destination = audioContext.createMediaStreamDestination();

        // Connect the processed audio to the destination
        source.connect(destination);

        // Send the processed audio stream to the peer connection
        destination.stream.getTracks().forEach((track) => {
          peerConnection?.addTrack(track, destination.stream);
        });

        audio.play();
      };
    };

    audioSocket.onerror = (error) => {
      console.error("Audio WebSocket error:", error);
    };

    audioSocket.onclose = (event) => {
      console.log("Audio WebSocket connection closed:", event);
    };

    socket.onopen = async () => {
      console.log("WebSocket connection opened.");

      // Initialize the WebRTC connection
      const peerConnection = new RTCPeerConnection(servers);
      setPeerConnection(peerConnection);

      // Add local stream tracks to the WebRTC connection
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        }
      };

      // Handle signaling messages from WebSocket
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "offer") {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.send(JSON.stringify({ type: "answer", answer: peerConnection.localDescription }));
        } else if (message.type === "answer") {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
        } else if (message.type === "candidate") {
          await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else if (message.type === "chat") {
          setMessages((prevMessages) => [...prevMessages, message.text]);
        }
      };

      // Create an offer if this is the initiating peer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.send(JSON.stringify({ type: "offer", offer }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };
  };

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.send(JSON.stringify({ type: "chat", text: message }));
      setMessages((prevMessages) => [...prevMessages, `Me: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>WebRTC with Next.js</h1>
      <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px" }} />
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
      <br />
      <button onClick={handleStart}>Start</button>

      <div style={{ marginTop: "20px" }}>
        <h2>Chat</h2>
        <div style={{ height: "100px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
