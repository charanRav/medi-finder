// Comprehensive dummy data for realistic prototype demonstration

export interface City {
  id: string;
  name: string;
  state: string;
  coords: { lat: number; lng: number };
}

export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  distance: number;
  latitude: number;
  longitude: number;
  rating: number;
  openingHours: string;
  hasParking: boolean;
  is24Hours: boolean;
}

// Major Indian cities with coordinates
export const cities: City[] = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', coords: { lat: 19.0760, lng: 72.8777 } },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', coords: { lat: 28.7041, lng: 77.1025 } },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', coords: { lat: 12.9716, lng: 77.5946 } },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', coords: { lat: 17.3850, lng: 78.4867 } },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', coords: { lat: 13.0827, lng: 80.2707 } },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', coords: { lat: 22.5726, lng: 88.3639 } },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', coords: { lat: 18.5204, lng: 73.8567 } },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', coords: { lat: 23.0225, lng: 72.5714 } },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', coords: { lat: 26.9124, lng: 75.7873 } },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', coords: { lat: 26.8467, lng: 80.9462 } },
];

// Pharmacy chains and independent pharmacies by city
const pharmacyTemplates = {
  mumbai: [
    { name: 'Apollo Pharmacy', area: 'Andheri West', phone: '+91-22-2673-4567' },
    { name: 'MedPlus', area: 'Bandra', phone: '+91-22-2640-8901' },
    { name: 'Wellness Forever', area: 'Powai', phone: '+91-22-2571-2345' },
    { name: '1mg', area: 'Goregaon', phone: '+91-22-2875-6789' },
    { name: 'PharmEasy Store', area: 'Malad', phone: '+91-22-2880-1234' },
    { name: 'Netmeds', area: 'Borivali', phone: '+91-22-2899-5678' },
    { name: 'HealthKart Pharmacy', area: 'Dadar', phone: '+91-22-2414-9012' },
    { name: 'Local Care Pharmacy', area: 'Kandivali', phone: '+91-22-2868-3456' },
    { name: 'City Medical Store', area: 'Kurla', phone: '+91-22-2507-7890' },
    { name: 'Quick Heal Medicines', area: 'Vikhroli', phone: '+91-22-2577-1234' },
    { name: 'Health Plus', area: 'Mulund', phone: '+91-22-2563-5678' },
    { name: 'Care & Cure Pharmacy', area: 'Thane', phone: '+91-22-2537-9012' },
  ],
  delhi: [
    { name: 'Apollo Pharmacy', area: 'Connaught Place', phone: '+91-11-2334-5678' },
    { name: 'MedPlus', area: 'Saket', phone: '+91-11-4165-9012' },
    { name: 'Wellness Forever', area: 'Dwarka', phone: '+91-11-4507-3456' },
    { name: 'Netmeds', area: 'Rohini', phone: '+91-11-2756-7890' },
    { name: 'HealthKart Pharmacy', area: 'Lajpat Nagar', phone: '+91-11-2984-1234' },
    { name: 'MediCare Center', area: 'Vasant Kunj', phone: '+91-11-4166-5678' },
    { name: 'Life Care Pharmacy', area: 'Karol Bagh', phone: '+91-11-2575-9012' },
    { name: 'Health Hub', area: 'Janakpuri', phone: '+91-11-2559-3456' },
    { name: 'Quick Meds', area: 'Mayur Vihar', phone: '+91-11-2275-7890' },
    { name: 'City Pharmacy', area: 'Pitampura', phone: '+91-11-2734-1234' },
    { name: 'Remedy Store', area: 'Rajouri Garden', phone: '+91-11-2510-5678' },
    { name: 'Medical Corner', area: 'Nehru Place', phone: '+91-11-2643-9012' },
  ],
  bangalore: [
    { name: 'Apollo Pharmacy', area: 'Koramangala', phone: '+91-80-4112-3456' },
    { name: 'MedPlus', area: 'Indiranagar', phone: '+91-80-2521-7890' },
    { name: 'Wellness Forever', area: 'Whitefield', phone: '+91-80-2845-1234' },
    { name: 'Netmeds', area: 'JP Nagar', phone: '+91-80-2659-5678' },
    { name: '1mg Store', area: 'HSR Layout', phone: '+91-80-2573-9012' },
    { name: 'HealthKart Pharmacy', area: 'Marathahalli', phone: '+91-80-2535-3456' },
    { name: 'Care Plus Pharmacy', area: 'Jayanagar', phone: '+91-80-2663-7890' },
    { name: 'MediCare Plus', area: 'BTM Layout', phone: '+91-80-2678-1234' },
    { name: 'Health Station', area: 'Electronic City', phone: '+91-80-2785-5678' },
    { name: 'Quick Relief Pharmacy', area: 'Yelahanka', phone: '+91-80-2846-9012' },
    { name: 'Remedy Hub', area: 'Banashankari', phone: '+91-80-2661-3456' },
    { name: 'Life Care Medical', area: 'Rajajinagar', phone: '+91-80-2331-7890' },
  ],
  hyderabad: [
    { name: 'Apollo Pharmacy', area: 'Banjara Hills', phone: '+91-40-2335-1234' },
    { name: 'MedPlus', area: 'Kukatpally', phone: '+91-40-2372-5678' },
    { name: 'Wellness Forever', area: 'Madhapur', phone: '+91-40-2311-9012' },
    { name: 'Netmeds', area: 'Ameerpet', phone: '+91-40-2373-3456' },
    { name: 'HealthKart Pharmacy', area: 'Dilsukhnagar', phone: '+91-40-2404-7890' },
    { name: 'Care Pharmacy', area: 'Secunderabad', phone: '+91-40-2784-1234' },
    { name: 'Health Plus', area: 'LB Nagar', phone: '+91-40-2424-5678' },
    { name: 'MediWorld', area: 'Miyapur', phone: '+91-40-2304-9012' },
    { name: 'Quick Heal', area: 'Gachibowli', phone: '+91-40-2300-3456' },
    { name: 'Life Care', area: 'Kondapur', phone: '+91-40-2311-7890' },
    { name: 'City Medical', area: 'Habsiguda', phone: '+91-40-2771-1234' },
    { name: 'Health Hub', area: 'Nagole', phone: '+91-40-2443-5678' },
  ],
  chennai: [
    { name: 'Apollo Pharmacy', area: 'T Nagar', phone: '+91-44-2434-9012' },
    { name: 'MedPlus', area: 'Anna Nagar', phone: '+91-44-2615-3456' },
    { name: 'Wellness Forever', area: 'Velachery', phone: '+91-44-2246-7890' },
    { name: 'Netmeds', area: 'Adyar', phone: '+91-44-2441-1234' },
    { name: 'HealthKart Pharmacy', area: 'Porur', phone: '+91-44-2476-5678' },
    { name: 'Care Plus', area: 'Tambaram', phone: '+91-44-2226-9012' },
    { name: 'Health Station', area: 'Chrompet', phone: '+91-44-2247-3456' },
    { name: 'MediCare', area: 'Mylapore', phone: '+91-44-2466-7890' },
    { name: 'Quick Meds', area: 'Nungambakkam', phone: '+91-44-2827-1234' },
    { name: 'Life Care', area: 'OMR', phone: '+91-44-2450-5678' },
    { name: 'City Pharmacy', area: 'Kodambakkam', phone: '+91-44-2372-9012' },
    { name: 'Health Plus', area: 'Sholinganallur', phone: '+91-44-2450-3456' },
  ],
  kolkata: [
    { name: 'Apollo Pharmacy', area: 'Park Street', phone: '+91-33-2229-7890' },
    { name: 'MedPlus', area: 'Salt Lake', phone: '+91-33-2321-1234' },
    { name: 'Wellness Forever', area: 'New Town', phone: '+91-33-2359-5678' },
    { name: 'Netmeds', area: 'Howrah', phone: '+91-33-2662-9012' },
    { name: 'HealthKart Pharmacy', area: 'Ballygunge', phone: '+91-33-2440-3456' },
    { name: 'Care Pharmacy', area: 'Jadavpur', phone: '+91-33-2413-7890' },
    { name: 'Health Hub', area: 'Rajarhat', phone: '+91-33-2357-1234' },
    { name: 'MediWorld', area: 'Dum Dum', phone: '+91-33-2566-5678' },
    { name: 'Quick Relief', area: 'Behala', phone: '+91-33-2463-9012' },
    { name: 'Life Care', area: 'Barasat', phone: '+91-33-2562-3456' },
    { name: 'City Medical', area: 'Alipore', phone: '+91-33-2479-7890' },
    { name: 'Health Station', area: 'Gariahat', phone: '+91-33-2441-1234' },
  ],
  pune: [
    { name: 'Apollo Pharmacy', area: 'Koregaon Park', phone: '+91-20-2613-5678' },
    { name: 'MedPlus', area: 'Hinjewadi', phone: '+91-20-2293-9012' },
    { name: 'Wellness Forever', area: 'Viman Nagar', phone: '+91-20-2668-3456' },
    { name: 'Netmeds', area: 'Kothrud', phone: '+91-20-2542-7890' },
    { name: 'HealthKart Pharmacy', area: 'Aundh', phone: '+91-20-2588-1234' },
    { name: 'Care Plus', area: 'Wakad', phone: '+91-20-2749-5678' },
    { name: 'Health Station', area: 'Shivajinagar', phone: '+91-20-2553-9012' },
    { name: 'MediCare', area: 'Hadapsar', phone: '+91-20-2698-3456' },
    { name: 'Quick Meds', area: 'Baner', phone: '+91-20-2729-7890' },
    { name: 'Life Care', area: 'Pimpri', phone: '+91-20-2742-1234' },
    { name: 'City Pharmacy', area: 'Deccan', phone: '+91-20-2553-5678' },
    { name: 'Health Plus', area: 'Magarpatta', phone: '+91-20-2688-9012' },
  ],
  ahmedabad: [
    { name: 'Apollo Pharmacy', area: 'Satellite', phone: '+91-79-2630-3456' },
    { name: 'MedPlus', area: 'Vastrapur', phone: '+91-79-2630-7890' },
    { name: 'Wellness Forever', area: 'Maninagar', phone: '+91-79-2546-1234' },
    { name: 'Netmeds', area: 'SG Highway', phone: '+91-79-2970-5678' },
    { name: 'HealthKart Pharmacy', area: 'Bopal', phone: '+91-79-2716-9012' },
    { name: 'Care Pharmacy', area: 'Chandkheda', phone: '+91-79-2764-3456' },
    { name: 'Health Hub', area: 'Paldi', phone: '+91-79-2658-7890' },
    { name: 'MediWorld', area: 'Naranpura', phone: '+91-79-2749-1234' },
    { name: 'Quick Relief', area: 'Ghatlodia', phone: '+91-79-2758-5678' },
    { name: 'Life Care', area: 'Bodakdev', phone: '+91-79-2687-9012' },
    { name: 'City Medical', area: 'Thaltej', phone: '+91-79-2970-3456' },
    { name: 'Health Station', area: 'Navrangpura', phone: '+91-79-2644-7890' },
  ],
  jaipur: [
    { name: 'Apollo Pharmacy', area: 'Malviya Nagar', phone: '+91-141-401-1234' },
    { name: 'MedPlus', area: 'Vaishali Nagar', phone: '+91-141-232-5678' },
    { name: 'Wellness Forever', area: 'Mansarovar', phone: '+91-141-239-9012' },
    { name: 'Netmeds', area: 'Raja Park', phone: '+91-141-222-3456' },
    { name: 'HealthKart Pharmacy', area: 'Tonk Road', phone: '+91-141-272-7890' },
    { name: 'Care Plus', area: 'Jagatpura', phone: '+91-141-277-1234' },
    { name: 'Health Station', area: 'C-Scheme', phone: '+91-141-237-5678' },
    { name: 'MediCare', area: 'Bajaj Nagar', phone: '+91-141-265-9012' },
    { name: 'Quick Meds', area: 'Pratap Nagar', phone: '+91-141-262-3456' },
    { name: 'Life Care', area: 'Jhotwara', phone: '+91-141-265-7890' },
    { name: 'City Pharmacy', area: 'MI Road', phone: '+91-141-237-1234' },
    { name: 'Health Plus', area: 'Sitapura', phone: '+91-141-277-5678' },
  ],
  lucknow: [
    { name: 'Apollo Pharmacy', area: 'Gomti Nagar', phone: '+91-522-402-9012' },
    { name: 'MedPlus', area: 'Hazratganj', phone: '+91-522-262-3456' },
    { name: 'Wellness Forever', area: 'Aliganj', phone: '+91-522-236-7890' },
    { name: 'Netmeds', area: 'Indira Nagar', phone: '+91-522-234-1234' },
    { name: 'HealthKart Pharmacy', area: 'Alambagh', phone: '+91-522-265-5678' },
    { name: 'Care Pharmacy', area: 'Rajajipuram', phone: '+91-522-235-9012' },
    { name: 'Health Hub', area: 'Mahanagar', phone: '+91-522-238-3456' },
    { name: 'MediWorld', area: 'Chowk', phone: '+91-522-262-7890' },
    { name: 'Quick Relief', area: 'Aminabad', phone: '+91-522-262-1234' },
    { name: 'Life Care', area: 'Jankipuram', phone: '+91-522-405-5678' },
    { name: 'City Medical', area: 'Kaiserbagh', phone: '+91-522-223-9012' },
    { name: 'Health Station', area: 'Vikas Nagar', phone: '+91-522-234-3456' },
  ],
};

// Generate pharmacies for each city with realistic distances and stock levels
export const generatePharmaciesForCity = (cityId: string): PharmacyLocation[] => {
  const templates = pharmacyTemplates[cityId] || pharmacyTemplates.mumbai;
  const city = cities.find(c => c.id === cityId);
  
  if (!city) return [];

  return templates.map((template, index) => {
    const distance = Number((0.3 + index * 0.8 + Math.random() * 0.5).toFixed(1));
    const rating = Number((3.5 + Math.random() * 1.5).toFixed(1));
    
    return {
      id: `${cityId}-pharmacy-${index + 1}`,
      name: template.name,
      address: `${template.area}, ${city.name}`,
      city: city.name,
      phone: template.phone,
      distance,
      latitude: city.coords.lat + (Math.random() - 0.5) * 0.1,
      longitude: city.coords.lng + (Math.random() - 0.5) * 0.1,
      rating,
      openingHours: index % 4 === 0 ? 'Open 24 Hours' : '8:00 AM - 10:00 PM',
      hasParking: Math.random() > 0.3,
      is24Hours: index % 4 === 0,
    };
  });
};

// Get pharmacies within a specific range
export const getPharmaciesInRange = (cityId: string, rangeKm: number): PharmacyLocation[] => {
  const allPharmacies = generatePharmaciesForCity(cityId);
  return allPharmacies.filter(p => p.distance <= rangeKm);
};

// Medicine stock availability (random but consistent)
export const getMedicineStockForPharmacy = (pharmacyId: string, medicineId: string): {
  inStock: boolean;
  quantity: number;
  price: number;
} => {
  // Use a simple hash to make stock consistent for same pharmacy-medicine pair
  const hash = (pharmacyId + medicineId).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const inStock = Math.abs(hash % 100) > 15; // 85% stock availability
  const quantity = inStock ? Math.abs(hash % 50) + 5 : 0;
  const basePrice = Math.abs(hash % 200) + 50;
  
  return {
    inStock,
    quantity,
    price: Number(basePrice.toFixed(2)),
  };
};
