/**
 * USDA Hardiness Zone Mapping Utility
 * 
 * Maps ZIP codes to USDA Plant Hardiness Zones
 * Source: USDA 2023 Plant Hardiness Zone Map (approximate)
 * 
 * TODO: Replace with API call for comprehensive coverage
 */

export const getUSDAZone = (zipCode) => {
  // Simplified West Coast USDA Zone mapping
  const zoneMap = {
    // California
    '90210': '10a', // Beverly Hills, CA
    '94102': '10a', // San Francisco, CA
    '95616': '9b',  // Davis, CA
    '95814': '9b',  // Sacramento, CA
    '96001': '9a',  // Redding, CA
    '93561': '8b',  // Tehachapi, CA
    '90001': '10a', // Los Angeles, CA
    '92101': '10b', // San Diego, CA
    '93101': '10a', // Santa Barbara, CA
    '94301': '10a', // Palo Alto, CA
    '95401': '9b',  // Santa Rosa, CA
    '96150': '7a',  // South Lake Tahoe, CA
    
    // Oregon
    '97401': '8b',  // Eugene, OR
    '97201': '8b',  // Portland, OR
    '97701': '6b',  // Bend, OR
    '97501': '8a',  // Medford, OR
    '97301': '8b',  // Salem, OR
    '97330': '8b',  // Corvallis, OR
    '97477': '8b',  // Springfield, OR
    
    // Washington
    '98101': '8b',  // Seattle, WA
    '98501': '8a',  // Olympia, WA
    '99201': '6b',  // Spokane, WA
    '98661': '8b',  // Vancouver, WA
    '99301': '7a',  // Pasco, WA
    '98052': '8b',  // Redmond, WA
    '98004': '8b',  // Bellevue, WA
    '98225': '8b',  // Bellingham, WA
    
    // New York
    '10001': '7a',  // New York, NY
    '10019': '7a',  // New York, NY
    '11201': '7b',  // Brooklyn, NY
    '12201': '6a',  // Albany, NY
    '14201': '6b',  // Buffalo, NY
    '13201': '6a',  // Syracuse, NY
    
    // Florida
    '33101': '10b', // Miami, FL
    '32801': '9b',  // Orlando, FL
    '33401': '10a', // West Palm Beach, FL
    '32301': '8b',  // Tallahassee, FL
    '32601': '9a',  // Gainesville, FL
    '33701': '9b',  // St. Petersburg, FL
    
    // Texas
    '75201': '8a',  // Dallas, TX
    '77001': '9a',  // Houston, TX
    '78701': '8b',  // Austin, TX
    '79901': '8a',  // El Paso, TX
    '78201': '9a',  // San Antonio, TX
    '76101': '8a',  // Fort Worth, TX
    
    // Illinois
    '60601': '6a',  // Chicago, IL
    '60614': '6a',  // Chicago, IL
    '62701': '6a',  // Springfield, IL
    '61820': '5b',  // Champaign, IL
    
    // Colorado
    '80201': '5b',  // Denver, CO
    '80424': '4a',  // Breckenridge, CO
    '80301': '5b',  // Boulder, CO
    '80901': '5b',  // Colorado Springs, CO
    
    // Arizona
    '85001': '9b',  // Phoenix, AZ
    '85701': '9a',  // Tucson, AZ
    '86001': '6b',  // Flagstaff, AZ
    
    // Nevada
    '89101': '9a',  // Las Vegas, NV
    '89501': '6b',  // Reno, NV
    
    // Utah
    '84101': '7a',  // Salt Lake City, UT
    '84604': '6b',  // Provo, UT
    
    // Idaho
    '83702': '6a',  // Boise, ID
    '83340': '5a',  // Pocatello, ID
    
    // Montana
    '59701': '4b',  // Butte, MT
    '59102': '4b',  // Billings, MT
    
    // Wyoming
    '82001': '4b',  // Cheyenne, WY
    '83001': '4a',  // Jackson, WY
    
    // New Mexico
    '87101': '7a',  // Albuquerque, NM
    '88001': '8a',  // Las Cruces, NM
    
    // Default fallback for unknown ZIP codes
    'default': '7a'
  };

  return zoneMap[zipCode] || zoneMap['default'];
};

export default getUSDAZone;


