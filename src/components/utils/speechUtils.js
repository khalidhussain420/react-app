// src/utils/speechUtils.js

let currentUtterance = null; // Keep track of the current speech utterance

export const speakText = (text) => {
  if (currentUtterance) {
    speechSynthesis.cancel(); // Cancel any ongoing speech
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = "en-IN"; // Set language to Indian English

  const setVoiceAndSpeak = () => {
    const voices = speechSynthesis.getVoices();

    // Find a female Indian English voice
    let indianFemaleVoice = voices.find(
      (voice) =>
        voice.lang === "en-IN" &&
        (voice.name.includes("Female") ||
          voice.name.includes("Heera") ||
          voice.name.includes("Meera") ||
          voice.name.includes("Aisha"))
    );

    // If no exact Indian female voice, fallback to best available
    if (!indianFemaleVoice) {
      indianFemaleVoice = voices.find(
        (voice) => voice.lang.includes("en") && voice.name.includes("Female")
      );
    }

    if (indianFemaleVoice) {
      currentUtterance.voice = indianFemaleVoice;
    } else {
      console.warn("No suitable Indian female voice found.");
    }

    speechSynthesis.speak(currentUtterance);
  };

  // Ensure voices are loaded before setting the voice
  if (speechSynthesis.getVoices().length > 0) {
    setVoiceAndSpeak();
  } else {
    speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  }
};

export const updateSpeechRate = (rate) => {
  if (currentUtterance) {
    currentUtterance.rate = rate;
  }
};

export const stopSpeech = () => {
  if (currentUtterance) {
    speechSynthesis.cancel();
    currentUtterance = null;
  }
};
