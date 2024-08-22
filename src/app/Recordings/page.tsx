"use client";
import { useState } from 'react';
import axios from 'axios';

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
      console.log("started Recording")
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
        //console.log(blob);
        const formData = new FormData();
        formData.append('file', blob, 'audio.mp3'); // 'file' is the key, 'audio.mp3' is the filename
        console.log(formData)
// Send the FormData to your FastAPI backend
        
//formData.append('file', blob);
/*axios.post('http://127.0.0.1:8000/Audio', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.error(error);
});*/
        

        setRecordings(prev => new Map(prev.set(index, blob)));
        setRecordingStatus(prev => new Map(prev.set(index, 0))); // Reset the countdown
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Stop recording after 5 seconds

    } catch (error) {
      console.error('Error accessing audio devices.', error);
    }
  };
  
  const playRecording = (index:number) => {
    console.log(index)
    const audioBlob = recordings.get(index);
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
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
      
      const blob1 = recordings.get(0);
      const blob2 = recordings.get(1);
      const blob3 = recordings.get(2);
      const blob4 = recordings.get(3);
      const blob5 = recordings.get(4);

      if (blob1 && blob2 && blob3 && blob4 && blob5) {
        const formData = new FormData();
        formData.append('files', blob1, 'audio1.mp3');
        formData.append('files', blob2, 'audio2.mp3');
        formData.append('files', blob3, 'audio3.mp3');
        formData.append('files', blob4, 'audio4.mp3');
        formData.append('files', blob5, 'audio5.mp3');
        
        //console.log(formData)
        
        // Proceeding  with the logic to send formData (e.g., via fetch or axios)
        axios.post('http://127.0.0.1:8000/Audio', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }).then(response => {
          console.log(response.data);
      }).catch(error => {
          console.error(error);
      });
      } else {
        console.error("some recordes were not recorded correectly please record correctly");
      }
      

      stopUsingMicrophone();
    }
  };

  return (
    /*<div className="p-4">
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
    </div>*/
    /*<div className="p-6 min-h-screen bg-gray-900 text-white shadow-lg rounded-lg">
      <div className="max-w-full mx-auto">
        {!permissionGranted && (
          <button
            className="bg-gray-500 text-gray-900 px-6 py-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
            onClick={requestPermission}
          >
            Grant Microphone Access
          </button>
        )}
        <div className="overflow-x-auto mt-6">
          <table className="w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="border p-4 text-left">Sentence</th>
                <th className="border p-4 text-center">Record</th>
                <th className="border p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {sentences.map((sentence, index) => (
                <tr
                  key={index}
                  className={`transition-colors duration-300 ${
                    !recordings.has(index) ? 'bg-gray-800 text-white' : 'bg-green-800'
                  }`}
                >
                  <td className="border p-4">{sentence}</td>
                  <td className="border p-4 text-center">
                    <button
                      className="bg-gray-500 text-gray-900 px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                      onClick={() => startRecording(index)}
                      disabled={recordingStatus.get(index) !== undefined && recordingStatus.get(index)! > 0}
                    >
                      Record
                    </button>
                  </td>
                  <td className="border p-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-600 rounded mr-2 overflow-hidden" style={{ height: '30px' }}>
                        <div
                          className="bg-gradient-to-r from-gray-800 to-yellow-500 text-xl leading-none py-1 text-center text-white rounded"
                          style={{ width: `${Math.min((recordingStatus.get(index) ?? 0) / 5 * 100, 100)}%` }} // 5 seconds max
                        >
                          {recordingStatus.get(index) ?? 5}
                        </div>
                      </div>
                      <span className="text-gray-400">{recordingStatus.get(index) ?? 5}s</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="bg-gray-600 text-white px-6 py-4 rounded-lg shadow-md items-center hover:bg-green-400 transition duration-300 mt-6"
          onClick={handleStopButtonClick}
        >
          Stop Using Microphone and Go to Home
        </button>
      </div>
    </div>*/
    <div className="p-6 min-h-screen bg-gray-900 text-white shadow-lg rounded-lg">
  <div className="max-w-full mx-auto">
    {!permissionGranted && (
      <button
        className="bg-gray-500 text-gray-900 px-6 py-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
        onClick={requestPermission}
      >
        Grant Microphone Access
      </button>
    )}
    <div className="overflow-x-auto mt-6">
      <table className="w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700 text-gray-300">
            <th className="border p-4 text-left">Sentence</th>
            <th className="border p-4 text-center">Record</th>
            <th className="border p-4 text-center">Status</th>
            <th className="border p-4 text-center">Listen</th>
          </tr>
        </thead>
        <tbody>
          {sentences.map((sentence, index) => (
            <tr
              key={index}
              className={`transition-colors duration-300 ${
                !recordings.has(index) ? 'bg-gray-800 text-white' : 'bg-green-800'
              }`}
            >
              <td className="border p-4">{sentence}</td>
              <td className="border p-4 text-center">
                <button
                  className="bg-gray-500 text-gray-900 px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                  onClick={() => startRecording(index)}
                  disabled={recordingStatus.get(index) !== undefined && recordingStatus.get(index)! > 0}
                >
                  Record
                </button>
              </td>
              <td className="border p-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-600 rounded mr-2 overflow-hidden" style={{ height: '30px' }}>
                    <div
                      className="bg-gradient-to-r from-gray-800 to-yellow-500 text-xl leading-none py-1 text-center text-white rounded"
                      style={{ width: `${Math.min((recordingStatus.get(index) ?? 0) / 5 * 100, 100)}%` }} // 5 seconds max
                    >
                      {recordingStatus.get(index) ?? 5}
                    </div>
                  </div>
                  <span className="text-gray-400">{recordingStatus.get(index) ?? 5}s</span>
                </div>
              </td>
              <td className="border p-4 text-center">
                {recordings.has(index) ? (
                  <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    onClick={() => playRecording(index)}
                  >
                    Listen
                  </button>
                ) : (
                  <span className="text-gray-500">No Recording</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button
      className="bg-gray-600 text-white px-6 py-4 rounded-lg shadow-md items-center hover:bg-green-400 transition duration-300 mt-6"
      onClick={handleStopButtonClick}
    >
      Stop Using Microphone and Go to Home
    </button>
  </div>
</div>

  );
};

export default RecordingPage;
