// Cities configuration for listing page filtering
export const CITIES_CONFIG = {
  // City mapping with short codes for standardization
  CITY_MAPPINGS: {
    'CV': 'caribbean vida',
    'NY': 'new york',
    'MI': 'miami',
    'LA': 'los angeles',
    'CHI': 'chicago',
    'HOU': 'houston',
    'PHX': 'phoenix',
    'PHI': 'philadelphia',
    'SA': 'san antonio',
    'SD': 'san diego',
    'DAL': 'dallas',
    'SJ': 'san jose',
    'AUS': 'austin',
    'JAX': 'jacksonville',
    'SF': 'san francisco',
    'COL': 'columbus',
    'CHA': 'charlotte',
    'FW': 'fort worth',
    'DET': 'detroit',
    'ELP': 'el paso',
    'MEM': 'memphis',
    'SEA': 'seattle',
    'DEN': 'denver',
    'WAS': 'washington',
    'BOS': 'boston',
    'NAS': 'nashville',
    'BAL': 'baltimore',
    'LV': 'las vegas',
    'POR': 'portland',
    'OKC': 'oklahoma city',
    'MIL': 'milwaukee',
    'ABQ': 'albuquerque',
    'TUC': 'tucson',
    'FRE': 'fresno',
    'SAC': 'sacramento',
    'ATL': 'atlanta',
    'KAN': 'kansas city',
    'COB': 'colorado springs',
    'OMA': 'omaha',
    'RAL': 'raleigh',
    'MIN': 'minneapolis',
    'TB': 'tampa',
    'WIC': 'wichita',
    'NO': 'new orleans'
  },

  // Array of city codes to show in listing page
  // Use short codes from CITY_MAPPINGS above
  // Leave empty array [] to show all cities
  ENABLED_CITIES: [
    'CV', // caribbean vida
    // 'NY', // new york
    // 'MI', // miami
    // 'LA', // los angeles
  ],
  
  // Show all properties if no cities are configured
  SHOW_ALL_WHEN_EMPTY: true,
} as const;