import { displayNameAtom } from "@/atoms/atoms";
import { useSetAtom } from "jotai";

// utils/generateName.ts
export function generateRandomName() {
  const adjectives = ["Blue", "Neon", "Cosmic", "Wild", "Silent", "Golden", "Large", "Great", "Huge", "Petite", "Massive"];
  const animals = ["Tiger", "Panda", "Falcon", "Wolf", "Fox", "Dragon", "Donkey", "Gorilla", "Camel", "Mouse", "Goat"];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(100 + Math.random() * 900); // random 3-digit number

    return (`${adj}${animal}${num}`);
    
}
