"use client";
import { useState } from 'react';

const sentences: string[] = [
  "StreamLingo VoiceSync transforms your online meetings with advanced features like real-time language translations, interactive AI-powered tools.",
    "With Stream Lingo you can schedule a meeting join a metting and can attend the meeting at comfort of attending the meet at your prefered language.",
    "StreamLingo Provides an immensive experince of listening to the voice of speaker in their own voice modulation.",
    "Attend the meeting anywhere and have the hustle free comunication without any language barrier. ",
    "Thank you for proving your vocals for the mimicry you are all set to experience the unique way of experincing the meeting"
];

    

const RecordingPage: React.FC = () => {
  const [recordings, setRecordings] = useState<Map<number, Blob>>(new Map());
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [recordingStatus, setRecordingStatus] = useState<Map<number, number>>(new Map());
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestPermission = async (): Promise<void> => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing audio devices.', error);
      alert('Permission to access the microphone is required to record audio.');
    }
  };

  const startRecording = async (index: number): Promise<void> => {
    if (!permissionGranted) {
      alert('Permission to access the microphone is required to record audio.');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream!);
      const chunks: BlobPart[] = [];
      let timeLeft = 5;

      const countdown = setInterval(() => {
        setRecordingStatus(prev => new Map(prev.set(index, timeLeft)));
        if (timeLeft > 0) {
          timeLeft -= 1;
        } else {
          clearInterval(countdown);
        }
      }, 1000);

      mediaRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordings(prev => new Map(prev.set(index, blob)));
        setRecordingStatus(prev => new Map(prev.set(index, 0))); // Reset the countdown
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Stop recording after 5 seconds
    } catch (error) {
      console.error('Error accessing audio devices.', error);
    }
  };

  const stopUsingMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    window.location.href = '/Home'; // Redirect to the home page
  };

  const handleStopButtonClick = () => {
    const unrecordedSentences = sentences.filter((_, index) => !recordings.has(index));
    if (unrecordedSentences.length > 0) {
      alert('Please record all sentences before proceeding.');
    } else {
      stopUsingMicrophone();
    }
  };

  return (
    <div className="p-4">
      {!permissionGranted && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={requestPermission}
        >
          Grant Microphone Access
        </button>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Sentence</th>
            <th className="border p-2">Record</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sentences.map((sentence, index) => (
            <tr key={index} className={!recordings.has(index) ? 'bg-red-100' : ''}>
              <td className="border p-2">{sentence}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => startRecording(index)}
                  disabled={recordingStatus.get(index) !== undefined && recordingStatus.get(index)! > 0}
                >
                  Record
                </button>
              </td>
              <td className="border p-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded mr-2">
                    <div
                      className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
                      style={{ width: `${(recordingStatus.get(index) ?? 0) * 20}%` }} // Since 5 seconds, each second is 20%
                    >
                      {recordingStatus.get(index) ?? 0}
                    </div>
                  </div>
                  <span>{recordingStatus.get(index) ?? 0}s</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleStopButtonClick}
      >
        Stop Using Microphone and Go to Home
      </button>
    </div>
  );
};

export default RecordingPage;
