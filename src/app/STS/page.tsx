"use client"
import React, { useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import axios from 'axios';

const STSPage = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const peerRef = useRef<Peer | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [translatedText, setTranslatedText] = useState<string>('');

    useEffect(() => {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on('call', (call) => {
            if (peerRef.current && localStream) {
                call.answer(localStream);
                call.on('stream', (remoteStream: MediaStream) => {
                    setRemoteStream(remoteStream);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
            }
        });

        return () => {
            peer.destroy();
        };
    }, [localStream]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            })
            .catch((error) => console.error('Error accessing media devices.', error));
    }, []);

    const startCall = (id: string) => {
        if (peerRef.current && localStream) {
            const call = peerRef.current.call(id, localStream);
            call.on('stream', (remoteStream: MediaStream) => {
                setRemoteStream(remoteStream);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
            });
        }
    };

    const startRecording = () => {
        if (localStream) {
            const mediaRecorder = new MediaRecorder(localStream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e: BlobEvent) => {
                setRecordedChunks((prev) => [...prev, e.data]);
            };

            mediaRecorder.start();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'audio/wav' });
                console.log(blob)
                sendAudioForTranslation(blob);
            };
        }
    };

    const sendAudioForTranslation = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        formData.append('from_language_name', 'english');
        formData.append('to_language_name', 'french');

        try {
            const response = await axios.post('http://localhost:8000/translate', {
                method: 'POST',
                body: formData,
            });

            const data = await response.data;
            setTranslatedText(data.translated_text);
        } catch (error) {
            console.error('Error translating audio:', error);
        }
    };

    return (
        <div>
            <h1>Video Call and Recording with Translation</h1>
            <video ref={localVideoRef} autoPlay muted />
            <video ref={remoteVideoRef} autoPlay />
            <button onClick={() => startCall('remote-peer-id')}>Start Call</button>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording & Translate</button>
            {translatedText && <p>Translated Text: {translatedText}</p>}
        </div>
    );
};

export default STSPage;
