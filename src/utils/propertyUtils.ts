import { Property } from "@/data/properties";

/**
 * Get a random selection of properties
 * @param properties - Array of all properties
 * @param count - Number of random properties to return (default: 6)
 * @returns Array of randomly selected properties
 */
export const getRandomProperties = (properties: Property[], count: number = 6): Property[] => {
  if (properties.length <= count) {
    return properties;
  }
  
  const shuffled = [...properties].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get random properties ensuring no duplicates across multiple calls
 * Uses a simple rotation mechanism to ensure variety
 */
let lastSelectedIds: number[] = [];

export const getRandomPropertiesWithRotation = (properties: Property[], count: number = 6): Property[] => {
  if (properties.length <= count) {
    return properties;
  }
  
  // Filter out previously selected properties if we have enough alternatives
  let availableProperties = properties.filter(p => !lastSelectedIds.includes(p.id));
  
  // If we don't have enough different properties, reset and use all
  if (availableProperties.length < count) {
    availableProperties = properties;
    lastSelectedIds = [];
  }
  
  // Randomly select from available properties
  const shuffled = [...availableProperties].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  // Remember the selected IDs for next time
  lastSelectedIds = selected.map(p => p.id);
  
  return selected;
};