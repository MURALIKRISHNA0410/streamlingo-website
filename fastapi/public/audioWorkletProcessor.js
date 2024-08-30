class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input) {
        const channelData = input[0];
        if (channelData) {
          // Send the audio data to the main thread via postMessage
          this.port.postMessage(channelData);
        }
      }
      return true;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);
  