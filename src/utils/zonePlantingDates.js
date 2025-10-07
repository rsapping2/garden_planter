// Zone-specific planting dates for accurate garden planning
// Based on USDA hardiness zones and typical frost dates

export const ZONE_PLANTING_DATES = {
  tomato: {
    '3-4': { 
      plantingStart: '2024-06-01', 
      plantingEnd: '2024-07-15',
      harvestStart: '2024-08-15',
      harvestEnd: '2024-09-30'
    },
    '5-6': { 
      plantingStart: '2024-05-15', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-07-15',
      harvestEnd: '2024-09-30'
    },
    '7-8': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-07-01',
      harvestEnd: '2024-10-15'
    },
    '9-10': { 
      plantingStart: '2024-03-01', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-06-01',
      harvestEnd: '2024-11-15'
    },
    '11': { 
      plantingStart: '2024-02-01', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-05-01',
      harvestEnd: '2024-12-15'
    }
  },
  
  lettuce: {
    '3-4': { 
      plantingStart: '2024-05-01', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-06-15',
      harvestEnd: '2024-07-30'
    },
    '5-6': { 
      plantingStart: '2024-04-01', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-07-15'
    },
    '7-8': { 
      plantingStart: '2024-03-01', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-04-15',
      harvestEnd: '2024-06-30'
    },
    '9-10': { 
      plantingStart: '2024-02-01', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-03-15',
      harvestEnd: '2024-05-31'
    },
    '11': { 
      plantingStart: '2024-01-01', 
      plantingEnd: '2024-02-15',
      harvestStart: '2024-02-15',
      harvestEnd: '2024-04-30'
    }
  },
  
  carrot: {
    '3-4': { 
      plantingStart: '2024-05-01', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-08-01',
      harvestEnd: '2024-09-15'
    },
    '5-6': { 
      plantingStart: '2024-04-01', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-07-01',
      harvestEnd: '2024-08-15'
    },
    '7-8': { 
      plantingStart: '2024-03-01', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-06-15',
      harvestEnd: '2024-08-15'
    },
    '9-10': { 
      plantingStart: '2024-02-01', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-07-15'
    },
    '11': { 
      plantingStart: '2024-01-01', 
      plantingEnd: '2024-02-15',
      harvestStart: '2024-04-15',
      harvestEnd: '2024-06-15'
    }
  },
  
  pepper: {
    '3-4': { 
      plantingStart: '2024-06-01', 
      plantingEnd: '2024-07-01',
      harvestStart: '2024-08-15',
      harvestEnd: '2024-09-30'
    },
    '5-6': { 
      plantingStart: '2024-05-15', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-08-01',
      harvestEnd: '2024-10-15'
    },
    '7-8': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-07-15',
      harvestEnd: '2024-10-15'
    },
    '9-10': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-06-15',
      harvestEnd: '2024-11-15'
    },
    '11': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-12-15'
    }
  },
  
  cucumber: {
    '3-4': { 
      plantingStart: '2024-06-01', 
      plantingEnd: '2024-07-01',
      harvestStart: '2024-08-01',
      harvestEnd: '2024-09-15'
    },
    '5-6': { 
      plantingStart: '2024-05-15', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-07-15',
      harvestEnd: '2024-09-30'
    },
    '7-8': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-07-01',
      harvestEnd: '2024-09-30'
    },
    '9-10': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-06-01',
      harvestEnd: '2024-10-31'
    },
    '11': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-05-01',
      harvestEnd: '2024-11-30'
    }
  },
  
  beans: {
    '3-4': { 
      plantingStart: '2024-05-15', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-07-15',
      harvestEnd: '2024-09-15'
    },
    '5-6': { 
      plantingStart: '2024-05-01', 
      plantingEnd: '2024-06-01',
      harvestStart: '2024-07-01',
      harvestEnd: '2024-09-15'
    },
    '7-8': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-06-15',
      harvestEnd: '2024-09-15'
    },
    '9-10': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-09-15'
    },
    '11': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-04-15',
      harvestEnd: '2024-09-15'
    }
  },
  
  corn: {
    '3-4': { 
      plantingStart: '2024-05-15', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-08-15',
      harvestEnd: '2024-09-15'
    },
    '5-6': { 
      plantingStart: '2024-05-01', 
      plantingEnd: '2024-06-01',
      harvestStart: '2024-08-01',
      harvestEnd: '2024-09-15'
    },
    '7-8': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-07-15',
      harvestEnd: '2024-09-15'
    },
    '9-10': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-06-15',
      harvestEnd: '2024-08-15'
    },
    '11': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-07-15'
    }
  },
  
  potato: {
    '3-4': { 
      plantingStart: '2024-05-01', 
      plantingEnd: '2024-06-01',
      harvestStart: '2024-08-15',
      harvestEnd: '2024-09-30'
    },
    '5-6': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-08-01',
      harvestEnd: '2024-09-30'
    },
    '7-8': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-07-01',
      harvestEnd: '2024-09-30'
    },
    '9-10': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-06-01',
      harvestEnd: '2024-08-31'
    },
    '11': { 
      plantingStart: '2024-01-15', 
      plantingEnd: '2024-02-15',
      harvestStart: '2024-05-01',
      harvestEnd: '2024-07-31'
    }
  },
  
  spinach: {
    '3-4': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-06-01',
      harvestEnd: '2024-07-15'
    },
    '5-6': { 
      plantingStart: '2024-04-01', 
      plantingEnd: '2024-05-01',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-07-01'
    },
    '7-8': { 
      plantingStart: '2024-03-01', 
      plantingEnd: '2024-04-01',
      harvestStart: '2024-04-15',
      harvestEnd: '2024-06-15'
    },
    '9-10': { 
      plantingStart: '2024-02-01', 
      plantingEnd: '2024-03-01',
      harvestStart: '2024-03-15',
      harvestEnd: '2024-05-15'
    },
    '11': { 
      plantingStart: '2024-01-01', 
      plantingEnd: '2024-02-01',
      harvestStart: '2024-02-15',
      harvestEnd: '2024-04-15'
    }
  },
  
  strawberry: {
    '3-4': { 
      plantingStart: '2024-05-01', 
      plantingEnd: '2024-06-01',
      harvestStart: '2024-06-15',
      harvestEnd: '2024-08-15'
    },
    '5-6': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-06-01',
      harvestEnd: '2024-08-01'
    },
    '7-8': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-05-15',
      harvestEnd: '2024-07-15'
    },
    '9-10': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-04-15',
      harvestEnd: '2024-06-15'
    },
    '11': { 
      plantingStart: '2024-01-15', 
      plantingEnd: '2024-02-15',
      harvestStart: '2024-03-15',
      harvestEnd: '2024-05-15'
    }
  },
  
  basil: {
    '3-4': { 
      plantingStart: '2024-06-01', 
      plantingEnd: '2024-07-01',
      harvestStart: '2024-07-15',
      harvestEnd: '2024-09-15'
    },
    '5-6': { 
      plantingStart: '2024-05-15', 
      plantingEnd: '2024-06-15',
      harvestStart: '2024-07-01',
      harvestEnd: '2024-09-30'
    },
    '7-8': { 
      plantingStart: '2024-04-15', 
      plantingEnd: '2024-05-15',
      harvestStart: '2024-06-01',
      harvestEnd: '2024-09-30'
    },
    '9-10': { 
      plantingStart: '2024-03-15', 
      plantingEnd: '2024-04-15',
      harvestStart: '2024-05-01',
      harvestEnd: '2024-10-31'
    },
    '11': { 
      plantingStart: '2024-02-15', 
      plantingEnd: '2024-03-15',
      harvestStart: '2024-04-01',
      harvestEnd: '2024-11-30'
    }
  }
};

// Helper function to get zone-specific dates for a plant
export const getZoneSpecificDates = (plantId, userZone) => {
  const plantDates = ZONE_PLANTING_DATES[plantId];
  if (!plantDates) {
    // Fallback to generic dates if plant not in zone-specific database
    return null;
  }
  
  // Find the appropriate zone range
  const zoneNum = parseInt(userZone);
  let zoneRange = null;
  
  if (zoneNum >= 3 && zoneNum <= 4) zoneRange = '3-4';
  else if (zoneNum >= 5 && zoneNum <= 6) zoneRange = '5-6';
  else if (zoneNum >= 7 && zoneNum <= 8) zoneRange = '7-8';
  else if (zoneNum >= 9 && zoneNum <= 10) zoneRange = '9-10';
  else if (zoneNum >= 11) zoneRange = '11';
  
  return plantDates[zoneRange] || null;
};

// Helper function to format dates for display
export const formatPlantingWindow = (plantingStart, plantingEnd) => {
  const start = new Date(plantingStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const end = new Date(plantingEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${start} - ${end}`;
};


