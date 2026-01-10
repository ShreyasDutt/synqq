export function generateRandomName() {
  const adjectives = ["Blue", "Neon", "Cosmic", "Wild", "Silent", "Golden", "Large", "Great", "Huge", "Petite", "Massive"];
  const animals = ["Tiger", "Panda", "Falcon", "Wolf", "Fox", "Dragon", "Donkey", "Gorilla", "Camel", "Mouse", "Goat"];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(100 + Math.random() * 900);

    return (`${adj}${animal}${num}`);
    
}

export function countryCodeToEmoji(code: string | undefined) {
  if (!code) return "🏳️"; // fallback
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}