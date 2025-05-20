export interface PropertyTypes {
  [category: string]: string[];
}

export const buildingTypes: PropertyTypes = {
  "Government Offices": [
    "Government Offices / Secretariats",
    "Staff Quarters / Government Housing Units",
    "Guest Houses / Lodges"
  ],
  "Health": [
    "Hospitals / Health Centres",
    "Clinics / Medical Centres",
    "Pharmacies / Drug Stores",
    "Laboratories / Diagnostic Centres",
    "Nursing Homes / Retirement Homes",
    "Healthcare Training Centres / Institutes",
    "Healthcare Research Centres / Institutes"
  ],
  "Community & Cultural": [
    "Community Centres / Town Halls",
    "Libraries",
    "Event / Cultural Centres",
    "Youth Development Centres",
    "Religious Buildings (Chapels, Mosques owned by Government)"
  ],
  "Security & Justice": [
    "Police Stations",
    "Fire Service Stations",
    "Court Buildings",
    "Correctional Facilities / Prisons"
  ],
  "Commercial & Industrial": [
    "Commercial Buildings (e.g. shops owned by government)",
    "Markets (covered structures or stalls)",
    "Warehouses / Storage Facilities",
    "Industrial Buildings / Factories"
  ],
  "Tourism & Transport": [
    "Tourism Facilities (Resorts, Monuments with built structures)",
    "Transport Terminals / Motor Parks Buildings",
    "Sport Facilities (Buildings inside stadiums or complexes)"
  ],
  "Residential": [
    "Residential Buildings"
  ]
};

export const landTypes: PropertyTypes = {
  "Residential & Commercial": [
    "Residential Plot",
    "Commercial Plot",
    "Industrial Plot",
    "Government Reserved Area (GRA)",
    "Leasehold Plot"
  ],
  "Agricultural & Natural": [
    "Agricultural Land / Farmland",
    "Forest Reserve / Green Zone",
    "Water Resource Land (e.g., near dams, rivers)",
    "Buffer Zone / Right of Way"
  ],
  "Institutional": [
    "School Reserved Land",
    "Health Facility Reserved Land",
    "Cemetery / Burial Ground",
    "Recreational / Park Land"
  ],
  "Infrastructure & Development": [
    "Road / Transport Corridor Reserve",
    "Land for Public Infrastructure Projects",
    "Market Expansion Land",
    "Tourism Development Plot"
  ],
  "Special Categories": [
    "Unallocated Government Land",
    "Land with Disputes / Encumbrances",
    "Relocation / Resettlement Plot"
  ]
};

export const vehicleTypes: PropertyTypes = {
  "Official & Utility": [
    "Official Cars / Sedans",
    "Utility Vehicles (SUVs, Pickups)",
    "Buses / Staff Buses",
    "Vans / Delivery Trucks"
  ],
  "Emergency & Security": [
    "Ambulances",
    "Fire Trucks",
    "Police / Security Vehicles",
    "Mobile Clinics"
  ],
  "Construction & Industrial": [
    "Tractors",
    "Construction Vehicles (e.g., Bulldozers, Graders)",
    "Tankers (Fuel/Water)",
    "Garbage Trucks / Waste Collection Vehicles"
  ],
  "Transport & Service": [
    "Motorcycles",
    "Tricycles (Keke)",
    "Transport Authority Vehicles",
    "Agricultural Vans / Farm Utility Vehicles"
  ]
};

export const educationalInstitutionTypes: PropertyTypes = {
  "Basic Education": [
    "Nursery / Early Childhood Education Centre",
    "Primary School",
    "Secondary School",
    "Special Needs School"
  ],
  "Technical & Vocational": [
    "Technical College / Vocational School",
    "Science and Technical Education Centre",
    "Skills Acquisition Centre",
    "Teachers' Training College"
  ],
  "Higher Education": [
    "Tertiary Institution (College, Polytechnic, University)",
    "Research Institute",
    "ICT / Innovation Hub",
    "Adult Education Centre"
  ],
  "Support Facilities": [
    "Examination Centre / Board Office",
    "Library Facility (Institutional)",
    "Educational Administrative Building",
    "Student Hostel / Dormitory",
    "Staff Quarters (Education Sector)",
    "School Sports Facility"
  ]
};

export const equipmentAndInfrastructureTypes: PropertyTypes = {
  "ICT & Office": [
    "ICT Equipment (e.g., servers, computers, routers)",
    "Furniture & Office Equipment",
    "Security Equipment (e.g., CCTV, scanners)",
    "Signage & Billboards"
  ],
  "Power & Utilities": [
    "Power Generators / Inverters",
    "Water Facilities (e.g., boreholes, tanks, reservoirs)",
    "Waste Management Infrastructure (e.g., bins, incinerators)",
    "Public Lighting Infrastructure (e.g., street lights, poles)"
  ],
  "Medical & Safety": [
    "Medical Equipment (not tied to a hospital building)",
    "Firefighting Equipment (not vehicles)",
    "Environmental Monitoring Equipment",
    "Surveying & Engineering Instruments"
  ],
  "Transport & Traffic": [
    "Traffic Control Equipment (e.g., traffic lights, barriers)",
    "Boats / Ferries (if applicable)",
    "Toll Booths / Revenue Collection Points",
    "Mobile Structures (e.g., kiosks, portacabins)"
  ],
  "Cultural & Events": [
    "Event Equipment (e.g., public address systems, tents)",
    "Government Badged Uniforms / Regalia",
    "Artifacts / Cultural Heritage Items"
  ]
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