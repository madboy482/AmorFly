const profaneWords = [
  'badword1', 'badword2', 'badword3', 'badword4',
  'offensive1', 'offensive2', 'offensive3'
];

function filterProfanity(text) {
  if (!text) return text;
  
  let filteredText = text;
  
  profaneWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredText;
}

module.exports = filterProfanity;
