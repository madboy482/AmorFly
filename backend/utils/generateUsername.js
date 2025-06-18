const adjectives = [
  "Curious", "Bold", "Growth", "Mindful", "Quiet", "Brave", "Learner", 
  "Creative", "Focused", "Insightful", "Patient", "Vibrant", "Thoughtful",
  "Ambitious", "Radiant", "Skilled", "Aspiring", "Dedicated"
];

const nouns = [
  "Tiger", "Phoenix", "Falcon", "Owl", "Eagle", "Dolphin", "Lion",
  "Explorer", "Journey", "Maven", "Scholar", "Horizon", "Pioneer",
  "Voyager", "Builder", "Creator", "Mentor", "Achiever"
];

async function generateUsername() {
  try {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(100 + Math.random() * 900);
    return `${adjective}${noun}${number}`;
  } catch (err) {
    console.error("Error generating username:", err);
    return `Anonymous${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

module.exports = generateUsername;
