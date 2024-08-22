'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';

const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

const MeetingRoom = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [socket, setSocket] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize socket.io connection
    const socket = io('http://127.0.0.1:8000/sampleRoute',{
        transports: ['websocket'], 
    });
    setSocket(socket);

    // Get local video/audio stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
          ],
        });

        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        setPeerConnection(peerConnection);

        // Send the audio stream to the backend for processing
        const audioTrack = stream.getAudioTracks()[0];
        const audioStream = new MediaStream([audioTrack]);
        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(audioStream);

        const processor = audioContext.createScriptProcessor(1024, 1, 1);
        processor.onaudioprocess = (event) => {
          const audioData = event.inputBuffer.getChannelData(0);
          socket.emit('audio-data', {
            audioBuffer: audioData.buffer,
            language: selectedLanguage,
          });
        };

        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);

        // Handling ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('candidate', event.candidate);
          }
        };

        // Handling remote stream
        peerConnection.ontrack = (event) => {
          const [remoteStream] = event.streams;
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        // Create an offer
        peerConnection.createOffer()
          .then(offer => peerConnection.setLocalDescription(offer))
          .then(() => {
            socket.emit('offer', peerConnection.localDescription);
          });

        // Handle incoming offer/answer
        socket.on('offer', (offer) => {
          peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          peerConnection.createAnswer()
            .then(answer => peerConnection.setLocalDescription(answer))
            .then(() => {
              socket.emit('answer', peerConnection.localDescription);
            });
        });

        socket.on('answer', (answer) => {
          peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('candidate', (candidate) => {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        });

        // Handle incoming processed audio stream
        socket.on('processed-audio', (processedData: ArrayBuffer) => {
          audioContext.decodeAudioData(processedData, (buffer) => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);
            source.start();

            const processedTrack = destination.stream.getAudioTracks()[0];
            peerConnection.addTrack(processedTrack);
          });
        });

      }).catch(error => {
        console.error('Error accessing media devices.', error);
      });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [selectedLanguage]);

  return (
    <div className="meeting-room">
      <div className="local-video">
        <video ref={localVideoRef} autoPlay muted />
      </div>
      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <div className="language-selection">
        <label htmlFor="language">Choose your language:</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => router.push('/')}>Leave Meeting</button>
    </div>
  );
};

export default MeetingRoom;
