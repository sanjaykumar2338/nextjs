// Homepage configuration settings
export const HOMEPAGE_CONFIG = {
  // Default city for homepage property listings
  // Change this to any city you want to feature on the homepage
  DEFAULT_CITY: 'caribbean vida',
  
  // Number of properties to show in each section
  FEATURED_PROPERTIES_COUNT: 6,
  INTERACTIVE_TABS_COUNT: 5,
  HOMEPAGE2_PROPERTIES_COUNT: 3,
  HOMEPAGE3_PROPERTIES_COUNT: 4,
  
  // Fallback settings
  FALLBACK_TO_ALL_CITIES: true, // If no properties found in default city, show from all cities
} as const;