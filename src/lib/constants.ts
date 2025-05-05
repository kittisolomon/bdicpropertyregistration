export interface PropertyTypes {
  [category: string]: string[];
}

export const buildingTypes: PropertyTypes = {
  residential: ["Apartment", "House", "Villa", "Duplex", "Bungalow"],
  commercial: ["Office", "Shop", "Warehouse", "Mall", "Hotel"],
  institutional: ["School", "Hospital", "Government Building", "Religious Building"],
  industrial: ["Factory", "Workshop", "Storage Facility"]
};

export const landTypes: PropertyTypes = {
  residential: ["Residential Plot", "Housing Estate", "Gated Community"],
  commercial: ["Commercial Plot", "Industrial Plot", "Mixed-Use Plot"],
  agricultural: ["Farmland", "Plantation", "Grazing Land"],
  special: ["Waterfront", "Conservation Area", "Recreation"]
};

export const vehicleTypes: PropertyTypes = {
  passenger: ["Car", "Bus", "Van", "SUV", "Minibus"],
  commercial: ["Truck", "Trailer", "Tanker", "Delivery Van"],
  specialized: ["Ambulance", "Fire Truck", "Police Vehicle", "Construction Vehicle"],
  agricultural: ["Tractor", "Harvester", "Farm Truck"]
};

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara"
];

export const PROPERTY_STATUS = [
  "Active",
  "Inactive",
  "Under Maintenance",
  "Under Investigation",
  "Disposed",
  "Leased"
] as const;

export const PROPERTY_CONDITIONS = [
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Under Renovation",
  "Condemned"
] as const; 