// backend/utils/generateUsername.js
const adjectives = ["Curious", "Bold", "GrowthSeeker", "Mindful", "Quiet", "Brave", "Learner"];
const nouns = ["Tiger", "Phoenix", "Falcon", "Owl", "Eagle", "Dolphin", "Lion"];

function generateUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(100 + Math.random() * 900);
  return `${adjective}${noun}-${number}`;
}

module.exports = generateUsername;
