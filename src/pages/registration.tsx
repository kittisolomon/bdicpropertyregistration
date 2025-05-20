"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Plus, Trash2, Check, Building2, MapPin, Truck, Home as House, Fuel, Beaker, ChevronRight, FileText, Upload, QrCode, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IKContext, IKUpload } from 'imagekitio-react'
import axios from 'axios'
import { buildingTypes, landTypes, vehicleTypes, educationalInstitutionTypes, equipmentAndInfrastructureTypes } from "@/lib/constants"
import MapWithMarkers from "./MapWithMarkers"

// Add this constant at the top of the file after imports
const stateLGAs: Record<string, string[]> = {
  "fct": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal"],
  "abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
  "adamawa": ["Demsa", "Fufure", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "akwa-ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  "anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  "bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  "bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  "benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Oturkpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  "borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "cross-river": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
  "delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  "edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan East", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
  "ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
  "enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
  "gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  "imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
  "jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  "kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  "kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garum Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  "katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  "kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  "kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  "kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  "lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  "nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  "niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  "ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
  "ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  "osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  "oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  "plateau": ["Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  "rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  "sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabo Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  "taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  "yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  "zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Chafe", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"]
};

interface FormData {
  registeredBy:string
  // Basic Information
  propertyType: string
  propertyName: string
  propertyId: string
  description: string
  acquisitionDate: string
  estimatedValue: string
 
  // Property Specific Fields
  buildingType?: string
  floorCount?: string
  totalArea?: string
  yearBuilt?: string
  buildingCondition?: string
  buildingFeatures?: { name: string; quantity: number; condition: string }[]
  currentBuildingUse?: string

  // Land Specific Fields
  landType?: string
  landSize?: string
  landSizeUnit?: string
  landCondition?: string
  landUse?: string
  plotNumber?: string
  blockNumber?: string
  layoutName?: string
  surveyPlanNumber?: string
  beaconNumbers?: string
  perimeter?: string
  shape?: string
  topography?: string
  zoningClassification?: string
  titleType?: string
  titleReferenceNumber?: string
  easements?: string
  roadAccess?: string
  utilityAccess?: string[]
  proposedUse?: string
  currentUse?: string

  // Vehicle Specific Fields
  vehicleType?: string
  makeModel?: string
  year?: string
  registrationNumber?: string
  vin?: string
  engineNumber?: string
  vehicleCondition?: string
  color?: string
  seatingCapacity?: string
  purchasePrice?: string
  fuelType?: string
  transmission?: string
  mileage?: string
  lastServiceDate?: string
  nextServiceDue?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  insuranceExpiryDate?: string
  assignedDepartment?: string
  assignedDriver?: string
  parkingLocation?: string

  // Institution Specific Fields
  institutionType?: string
  institutionLevel?: string
  institutionName?: string
  yearEstablished?: string
  totalStudents?: string
  totalStaff?: string
  totalClassrooms?: string
  totalLaboratories?: string
  totalOffices?: string
  totalToilets?: string
  totalHostels?: string
  totalLibraries?: string
  totalAuditoriums?: string
  totalSportsFacilities?: string
  institutionCondition?: string
  institutionStatus?: string
  institutionFeatures?: string

  // Location Details
  state: string
  lga: string
  address: string
  latitude?: string
  longitude?: string

  // Documentation
  propertyDeed?: String[]
  propertyImages?: String[]
  additionalDocuments?: File[]

  // Confirmation
  notes?: string
  confirmed: boolean

  // Petroleum Specific Fields
  facilityType?: string
  facilityCapacity?: string
  facilityStatus?: string
  totalTanks?: string
  totalPumps?: string
  totalDispensers?: string
  totalStorage?: string
  fuelTypes?: string[]
  safetyCertification?: string
  lastInspectionDate?: string
  nextInspectionDate?: string
  facilityCondition?: string
  facilityFeatures?: string
  tankCapacities?: { type: string; capacity: string; unit: string }[]
  pumpTypes?: { type: string; count: string }[]
  safetyEquipment?: { name: string; quantity: string; lastInspection: string }[]
  otherPropertySubtype?: string
  totalRooms?: string
  totalBeds?: string
  operatingHours?: string
  maintenanceSchedule?: string
  equipmentList?: { name: string; quantity: string; condition: string }[]
  infrastructureDetails?: { type: string; specifications: string; status: string }[]
}

interface PropertyStats {
  totalProperties: number
  totalValue: number
  propertiesByType: {
    house: number
    land: number
    vehicle: number
  }
  propertiesByState: Record<string, number>
}

const urlEndpoint = 'https://ik.imagekit.io/bdic';
const publicKey = 'public_k/7VGHSYTH1q/STxZGOGFWUrsdE='; 
const authenticator =  async () => {
    try {
        const response = await axios.post('https://bdicisp.onrender.com/api/v1/auth/imagekit/auth');

        if (!response.data) {
            const errorText = await response.data;
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.data;
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        //throw new Error(`Authentication request failed: ${error.message}`);
    }
};

// Add this validation function near the top of the file, after the interfaces
const validateStep = (step: number, formData: FormData, photos: string[]): boolean => {
  switch (step) {
    case 1:
      // Basic validation for step 1
      if (!formData.propertyType || !formData.propertyName || !formData.description || !formData.acquisitionDate || !formData.estimatedValue) {
        return false;
      }

      // Property type specific validations
      switch (formData.propertyType) {
        case "house":
          return !!(formData.buildingType && formData.floorCount && formData.totalArea && formData.yearBuilt && formData.buildingCondition);
        case "land":
          return !!(
            formData.landType &&
            formData.landCondition &&
            formData.plotNumber && 
            formData.layoutName && 
            formData.titleType && 
            formData.titleReferenceNumber && 
            formData.landSize && 
            formData.landSizeUnit && 
            formData.shape && 
            formData.topography && 
            formData.currentUse && 
            formData.proposedUse && 
            formData.roadAccess && 
            formData.zoningClassification
          );
        case "vehicle":
          return !!(formData.vehicleType && formData.makeModel && formData.year && formData.registrationNumber);
        case "institutions":
          return !!(formData.institutionType && formData.institutionLevel && formData.institutionName && formData.yearEstablished);
        case "petroleum":
          return !!(formData.facilityType && formData.facilityCapacity && formData.facilityStatus);
        case "others":
          return !!(formData.otherPropertySubtype && formData.facilityCapacity && formData.facilityStatus);
        default:
          return false;
      }

    case 2:
      // Location details validation
      return !!(formData.state && formData.address && formData.latitude && formData.longitude);

    case 3:
      // Documentation validation
      return photos.length >= 3;

    case 4:
      // Confirmation validation
      return formData.confirmed;

    default:
      return false;
  }
};

export default function Registration() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<PropertyStats | null>(null)
  const [propertyDeeds,setPropertyDeeds] =useState<string[]>([]);
  const [propertyPhotos,setPropertyPhotos] =useState<string[]>([]);
  const [uploading,setUploading] = useState(false)
  const [iuploading,setIUploading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    registeredBy: "",
    propertyType: "",
    propertyName: "",
    description: "",
    acquisitionDate: "",
    estimatedValue: "",
    state: "",
    lga: "",
    address: "",
    confirmed: false,
    propertyId: "",
    buildingFeatures: []
  })
  const [newFeatureName, setNewFeatureName] = useState("")
  const [newFeatureQuantity, setNewFeatureQuantity] = useState("")
  const [newFeatureCondition, setNewFeatureCondition] = useState("")
  //const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Function to fetch property statistics
  const fetchPropertyStats = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await axios.get(
        "https://bdicisp.onrender.com/api/v1/properties/stats",
        { headers }
      )

      if (response.data) {
        setStats(response.data)
      }
    } catch (err) {
      console.error("Error fetching property stats:", err)
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          navigate("/login")
        } else {
          console.error(err.response?.data?.message || "Failed to fetch property statistics")
        }
      }
    }
  }
  //const isPDF = (url:any) => url.toLowerCase().endsWith(".pdf");
  // Fetch stats when component mounts
  useEffect(() => {
    setLocationError(null)
    fetchPropertyStats()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for institution features
    if (name === 'institutionFeatures') {
      setFormData(prev => ({
        ...prev,
        institutionFeatures: value ? value.split('\n').join('\n') : ""
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

 
useEffect(() => {
  formData.propertyId = `BENGOV/${formData.state.toLocaleUpperCase().slice(0,3)}/${new Date().getFullYear()}/${new Date().getTime()}`

formData.propertyImages=propertyPhotos

console.log(propertyPhotos)
console.log(formData.propertyImages)
}, [formData.state,propertyPhotos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      //formData.propertyId = `BENGOV/${formData.state.toLocaleUpperCase().slice(0,3)}/${new Date().getFullYear()}/${new Date().getTime()}`

    
      // Add authorization header if token exists
      const token = localStorage.getItem("authToken")
      //const user = localStorage.getItem("")
      //const headers = token ? { Authorization: `Bearer ${token}` } : {}

      console.error(JSON.stringify(formData))
      const users = localStorage.getItem("userData")
      if (!users) {
        console.error("No user data found")
        return
      }
      const userData = JSON.parse(users)
      formData.registeredBy  = userData._id
      
      const response = await axios.post(
        "https://bdicisp.onrender.com/api/v1/properties/collection",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 201) {
        toast.success('Property registered successfully')
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to register property')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const onPdeedsError = (err:any) => {
    console.log("Error", err);
    setUploading(false)
  };
  
  const onPdeedsSuccess = (res:any) => {
    setUploading(false)
    setPropertyDeeds((prevImages) => [...prevImages , res.url]);
    console.log("Success", res);
  };

  const onPdeedsUploadProgress = (progress:any) => {
    setUploading(true)
    console.log("Progress...", progress);
  };


  const onIdeedsError = (err:any) => {
    console.log("Error", err);
    setIUploading(false)
  };
  
  const onIdeedsSuccess = (res:any) => {
    setIUploading(false)
    setPropertyPhotos((prevImages) => [...prevImages , res.url]);
    console.log("Success", res,propertyPhotos);
  };

  const onIdeedsUploadProgress = (progress:any) => {
    setIUploading(true)
    console.log("Progress...", progress);
  };

  // Handler for feature name input
  const handleFeatureNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeatureName(e.target.value);
  };

  // Handler for feature quantity input
  const handleFeatureQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeatureQuantity(e.target.value);
  };

  // Handler for feature condition select
  const handleFeatureConditionChange = (value: string) => {
    setNewFeatureCondition(value);
  };

  // Function to add a feature to the list
  const handleAddFeature = () => {
    if (!newFeatureName.trim() || !newFeatureQuantity.trim() || !newFeatureCondition) return;
    const quantity = parseInt(newFeatureQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) return;

    const newFeature = { name: newFeatureName.trim(), quantity, condition: newFeatureCondition };

    setFormData(prev => ({
      ...prev,
      buildingFeatures: [...(prev.buildingFeatures || []), newFeature]
    }));

    // Clear inputs including condition
    setNewFeatureName("");
    setNewFeatureQuantity("");
    setNewFeatureCondition("");
  };

  // Function to remove a feature from the list
  const handleRemoveFeature = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      buildingFeatures: (prev.buildingFeatures || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add these new functions for removing images
  const handleRemoveDeed = (indexToRemove: number) => {
    setPropertyDeeds((prevDeeds) => prevDeeds.filter((_, index) => index !== indexToRemove));
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPropertyPhotos((prevPhotos) => prevPhotos.filter((_, index) => index !== indexToRemove));
  };

  const renderPropertySpecificFields = () => {
    switch (formData.propertyType) {
      case "institutions":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="institutionType">Institution Type</Label>
              <Select onValueChange={(value) => handleSelectChange("institutionType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select institution type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(educationalInstitutionTypes).map(([category, types]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionLevel">Institution Level</Label>
              <Select onValueChange={(value) => handleSelectChange("institutionLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select institution level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="mission">Mission</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  placeholder="Enter full institution name"
                  value={formData.institutionName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearEstablished">Year Established</Label>
                <Input
                  id="yearEstablished"
                  name="yearEstablished"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearEstablished || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalStudents">Total Students</Label>
                <Input
                  id="totalStudents"
                  name="totalStudents"
                  type="number"
                  min="0"
                  value={formData.totalStudents || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalStaff">Total Staff</Label>
                <Input
                  id="totalStaff"
                  name="totalStaff"
                  type="number"
                  min="0"
                  value={formData.totalStaff || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalClassrooms">Total Classrooms</Label>
                <Input
                  id="totalClassrooms"
                  name="totalClassrooms"
                  type="number"
                  min="0"
                  value={formData.totalClassrooms || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalLaboratories">Total Laboratories</Label>
                <Input
                  id="totalLaboratories"
                  name="totalLaboratories"
                  type="number"
                  min="0"
                  value={formData.totalLaboratories || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalOffices">Total Offices</Label>
                <Input
                  id="totalOffices"
                  name="totalOffices"
                  type="number"
                  min="0"
                  value={formData.totalOffices || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalToilets">Total Toilets</Label>
                <Input
                  id="totalToilets"
                  name="totalToilets"
                  type="number"
                  min="0"
                  value={formData.totalToilets || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalHostels">Total Hostels</Label>
                <Input
                  id="totalHostels"
                  name="totalHostels"
                  type="number"
                  min="0"
                  value={formData.totalHostels || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalLibraries">Total Libraries</Label>
                <Input
                  id="totalLibraries"
                  name="totalLibraries"
                  type="number"
                  min="0"
                  value={formData.totalLibraries || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalAuditoriums">Total Auditoriums</Label>
                <Input
                  id="totalAuditoriums"
                  name="totalAuditoriums"
                  type="number"
                  min="0"
                  value={formData.totalAuditoriums || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSportsFacilities">Total Sports Facilities</Label>
                <Input
                  id="totalSportsFacilities"
                  name="totalSportsFacilities"
                  type="number"
                  min="0"
                  value={formData.totalSportsFacilities || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionCondition">Institution Condition</Label>
              <Select onValueChange={(value) => handleSelectChange("institutionCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                  <SelectItem value="under_renovation">Under Renovation</SelectItem>
                  <SelectItem value="dilapidated">Dilapidated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionStatus">Institution Status</Label>
              <Select onValueChange={(value) => handleSelectChange("institutionStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="temporary_closed">Temporarily Closed</SelectItem>
                  <SelectItem value="under_construction">Under Construction</SelectItem>
                  <SelectItem value="renovation">Under Renovation</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionFeatures">Special Features</Label>
              <Textarea
                id="institutionFeatures"
                name="institutionFeatures"
                placeholder="Describe any special features or facilities (e.g., ICT center, science park, etc.)"
                value={formData.institutionFeatures || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Dynamic Features Section for Institutions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold mb-4 text-gray-700">Institution Equipment/Contents</h4>
              
              {/* Display Added Features */}
              {formData.institutionFeatures && (
                <div className="mb-4 space-y-2">
                  {formData.institutionFeatures.split('\n').filter(Boolean).map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <span className="text-sm text-gray-800">
                        {feature}
                      </span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 h-6 px-2"
                        onClick={() => {
                          const features = formData.institutionFeatures?.split('\n') || [];
                          features.splice(index, 1);
                          setFormData(prev => ({
                            ...prev,
                            institutionFeatures: features.join('\n')
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input for Adding New Feature */}
              <div className="flex items-end gap-3">
                <div className="flex-grow space-y-1">
                  <Label htmlFor="feature-name" className="text-xs">Feature Name</Label>
                  <Input
                    id="feature-name"
                    placeholder="e.g., Computers, Projectors, etc."
                    value={newFeatureName}
                    onChange={handleFeatureNameChange}
                    className="h-9"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    if (!newFeatureName.trim()) return;
                    const currentFeatures = formData.institutionFeatures || '';
                    const newFeatures = currentFeatures 
                      ? `${currentFeatures}\n${newFeatureName.trim()}`
                      : newFeatureName.trim();
                    setFormData(prev => ({
                      ...prev,
                      institutionFeatures: newFeatures
                    }));
                    setNewFeatureName('');
                  }} 
                  className="h-9"
                  disabled={!newFeatureName.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </>
        )
      case "house":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="buildingType">Building Type</Label>
              <Select onValueChange={(value) => handleSelectChange("buildingType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(buildingTypes).map(([category, types]: [string, string[]]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category.toUpperCase()}</SelectLabel>
                      {types.map((type: string) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              
              </div>
              <div className="space-y-2">
              <Label htmlFor="floorCount">Number of Floors</Label>
                <Input
                id="floorCount"
                name="floorCount"
                  type="number"
                min="1"
                value={formData.floorCount || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
              <Label htmlFor="totalArea">Total Floor Area (sqm)</Label>
                <Input
                id="totalArea"
                name="totalArea"
                  type="number"
                  min="0"
                step="0.01"
                value={formData.totalArea || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                id="yearBuilt"
                name="yearBuilt"
                  type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.yearBuilt || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
              <Label htmlFor="buildingCondition">Building Condition</Label>
              <Select onValueChange={(value) => handleSelectChange("buildingCondition", value)} value={formData.buildingCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Added Current Building Use field */}
            <div className="space-y-2">
              <Label htmlFor="currentBuildingUse">Current Building Use</Label>
              <Select onValueChange={(value) => handleSelectChange("currentBuildingUse", value)} value={formData.currentBuildingUse}>
                <SelectTrigger id="currentBuildingUse">
                  <SelectValue placeholder="Select current use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="occupied_by_govt">Occupied (Government Use)</SelectItem>
                  <SelectItem value="occupied_residential">Occupied (Residential)</SelectItem>
                  <SelectItem value="leased_commercial">Leased (Commercial)</SelectItem>
                  <SelectItem value="leased_residential">Leased (Residential)</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="under_renovation">Under Renovation/Construction</SelectItem>
                  <SelectItem value="mixed_use">Mixed Use</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Dynamic Features Section --- */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold mb-4 text-gray-700">Building Features/Contents</h4>
              
              {/* Display Added Features - Include condition */}
              {(formData.buildingFeatures && formData.buildingFeatures.length > 0) && (
                <div className="mb-4 space-y-2">
                  {formData.buildingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <span className="text-sm text-gray-800">
                        {feature.name}: <span className="font-medium">{feature.quantity}</span> ({feature.condition})
                      </span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 h-6 px-2"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Inputs for Adding New Feature */}
              <div className="flex items-end gap-3">
                {/* Feature Name Input */}
                <div className="flex-grow space-y-1">
                  <Label htmlFor="feature-name" className="text-xs">Feature Name</Label>
                  <Input
                    id="feature-name"
                    placeholder="e.g., Furniture"
                    value={newFeatureName}
                    onChange={handleFeatureNameChange}
                    className="h-9"
                  />
                </div>
                {/* Quantity Input */}
                <div className="w-24 space-y-1">
                  <Label htmlFor="feature-quantity" className="text-xs">Quantity</Label>
                  <Input
                    id="feature-quantity"
                    type="number"
                    placeholder="e.g., 50"
                    min="1"
                    value={newFeatureQuantity}
                    onChange={handleFeatureQuantityChange}
                    className="h-9"
                  />
                </div>
                {/* Condition Select */}
                <div className="w-32 space-y-1">
                  <Label htmlFor="feature-condition" className="text-xs">Condition</Label>
                  <Select value={newFeatureCondition} onValueChange={handleFeatureConditionChange}>
                    <SelectTrigger id="feature-condition" className="h-9">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Renovated">Renovated</SelectItem>
                      <SelectItem value="Repaired">Repaired</SelectItem>
                      <SelectItem value="Old">Old</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Add Button - Updated disabled logic */}
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddFeature} 
                  className="h-9"
                  disabled={!newFeatureName.trim() || !newFeatureQuantity.trim() || !newFeatureCondition}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            {/* --- End Dynamic Features Section --- */}
          </>
        )
      case "land":
        return (
          <>
            {/* --- Land Identification --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Land Identification</h4>
            <div className="space-y-2">
              <Label htmlFor="landType">Land Type</Label>
              <Select onValueChange={(value) => handleSelectChange("landType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential Plot">Residential Plot</SelectItem>
                  <SelectItem value="Commercial Plot">Commercial Plot</SelectItem>
                  <SelectItem value="Industrial Plot">Industrial Plot</SelectItem>
                  <SelectItem value="Agricultural Land">Agricultural Land / Farmland</SelectItem>
                  <SelectItem value="Forest Reserve">Forest Reserve / Green Zone</SelectItem>
                  <SelectItem value="School Reserved Land">School Reserved Land</SelectItem>
                  <SelectItem value="Health Facility Reserved Land">Health Facility Reserved Land</SelectItem>
                  <SelectItem value="Government Reserved Area">Government Reserved Area (GRA)</SelectItem>
                  <SelectItem value="Recreational Land">Recreational / Park Land</SelectItem>
                  <SelectItem value="Cemetery">Cemetery / Burial Ground</SelectItem>
                  <SelectItem value="Road Reserve">Road / Transport Corridor Reserve</SelectItem>
                  <SelectItem value="Water Resource Land">Water Resource Land (e.g., near dams, rivers)</SelectItem>
                  <SelectItem value="Market Expansion Land">Market Expansion Land</SelectItem>
                  <SelectItem value="Unallocated Government Land">Unallocated Government Land</SelectItem>
                  <SelectItem value="Land with Disputes">Land with Disputes / Encumbrances</SelectItem>
                  <SelectItem value="Leasehold Plot">Leasehold Plot</SelectItem>
                  <SelectItem value="Public Infrastructure Land">Land for Public Infrastructure Projects</SelectItem>
                  <SelectItem value="Buffer Zone">Buffer Zone / Right of Way</SelectItem>
                  <SelectItem value="Tourism Development Plot">Tourism Development Plot</SelectItem>
                  <SelectItem value="Relocation Plot">Relocation / Resettlement Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="landCondition">Land Condition</Label>
              <Select onValueChange={(value) => handleSelectChange("landCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                  <SelectItem value="Under Development">Under Development</SelectItem>
                  <SelectItem value="Abandoned">Abandoned</SelectItem>
                  <SelectItem value="Contaminated">Contaminated</SelectItem>
                  <SelectItem value="Eroded">Eroded</SelectItem>
                  <SelectItem value="Flooded">Flooded</SelectItem>
                  <SelectItem value="Overgrown">Overgrown</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plotNumber">Plot Number</Label>
              <Input id="plotNumber" name="plotNumber" value={formData.plotNumber || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="layoutName">Layout Name/Scheme</Label>
              <Select onValueChange={(value) => handleSelectChange("layoutName", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select layout/scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New GRA">New GRA</SelectItem>
                  <SelectItem value="Old GRA">Old GRA</SelectItem>
                  <SelectItem value="Federal Low-Cost Housing Scheme">Federal Low-Cost Housing Scheme</SelectItem>
                  <SelectItem value="High-Level Layout">High-Level Layout</SelectItem>
                  <SelectItem value="Low-Level Layout">Low-Level Layout</SelectItem>
                  <SelectItem value="Wurukum Layout">Wurukum Layout</SelectItem>
                  <SelectItem value="Modern Market Layout">Modern Market Layout</SelectItem>
                  <SelectItem value="North Bank Layout">North Bank Layout</SelectItem>
                  <SelectItem value="Nyiman Layout">Nyiman Layout</SelectItem>
                  <SelectItem value="Apir Industrial Layout">Apir Industrial Layout</SelectItem>
                  <SelectItem value="Welfare Quarters Layout">Welfare Quarters Layout</SelectItem>
                  <SelectItem value="Staff Quarters Scheme">Staff Quarters Scheme</SelectItem>
                  <SelectItem value="Education Board Housing Scheme">Education Board Housing Scheme</SelectItem>
                  <SelectItem value="Police Barracks Layout">Police Barracks Layout</SelectItem>
                  <SelectItem value="Army Barracks Layout">Army Barracks Layout</SelectItem>
                  <SelectItem value="Custom Layout">Custom Layout</SelectItem>
                  <SelectItem value="Industrial Layout">Industrial Layout</SelectItem>
                  <SelectItem value="Agric Layout">Agric Layout</SelectItem>
                  <SelectItem value="Judges Quarters Layout">Judges Quarters Layout</SelectItem>
                  <SelectItem value="Mobile Police Quarters Layout">Mobile Police Quarters Layout</SelectItem>
                  <SelectItem value="Government Reserved Area (GRA)">Government Reserved Area (GRA)</SelectItem>
                  <SelectItem value="Makurdi International Market Layout">Makurdi International Market Layout</SelectItem>
                  <SelectItem value="Private Developer Estate">Private Developer Estate</SelectItem>
                  <SelectItem value="Unplanned Area / Informal Settlement">Unplanned Area / Informal Settlement</SelectItem>
                  <SelectItem value="Other">Other (Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyPlanNumber">Survey Plan Number (Optional)</Label>
              <Input id="surveyPlanNumber" name="surveyPlanNumber" value={formData.surveyPlanNumber || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beaconNumbers">Beacon Numbers (Optional)</Label>
              <Input id="beaconNumbers" name="beaconNumbers" value={formData.beaconNumbers || ""} onChange={handleInputChange} />
            </div>

            {/* --- Title Information --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Title Information</h4>
            <div className="space-y-2">
              <Label htmlFor="titleType">Title Type</Label>
              <Select onValueChange={(value) => handleSelectChange("titleType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificate of Occupancy">Certificate of Occupancy (C of O)</SelectItem>
                  <SelectItem value="Right of Occupancy">Right of Occupancy (R of O)</SelectItem>
                  <SelectItem value="Deed of Assignment">Deed of Assignment</SelectItem>
                  <SelectItem value="Deed of Conveyance">Deed of Conveyance</SelectItem>
                  <SelectItem value="Freehold">Freehold</SelectItem>
                  <SelectItem value="Customary Right of Occupancy">Customary Right of Occupancy</SelectItem>
                  <SelectItem value="Gazette">Gazette</SelectItem>
                  <SelectItem value="Excision">Excision</SelectItem>
                  <SelectItem value="Allocation Letter">Allocation Letter</SelectItem>
                  <SelectItem value="Government Lease">Government Lease</SelectItem>
                  <SelectItem value="Unknown">Unknown / Unregistered</SelectItem>
                  <SelectItem value="Other">Other (Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleReferenceNumber">Title Reference Number</Label>
              <Input 
                id="titleReferenceNumber" 
                name="titleReferenceNumber" 
                placeholder="e.g. BS/CERT/2345/2021"
                value={formData.titleReferenceNumber || ""} 
                onChange={handleInputChange} 
              />
            </div>

            {/* --- Physical Attributes --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Physical Attributes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landSize">Land Size</Label>
                <div className="flex gap-2">
                  <Input
                    id="landSize"
                    name="landSize"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.landSize || ""}
                    onChange={handleInputChange}
                  />
                  <Select onValueChange={(value) => handleSelectChange("landSizeUnit", value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                      <SelectItem value="ha">Hectares (ha)</SelectItem>
                      <SelectItem value="acres">Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape">Shape</Label>
                <Select onValueChange={(value) => handleSelectChange("shape", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rectangular">Rectangular</SelectItem>
                    <SelectItem value="Square">Square</SelectItem>
                    <SelectItem value="Irregular">Irregular</SelectItem>
                    <SelectItem value="L-Shaped">L-Shaped</SelectItem>
                    <SelectItem value="Trapezoidal">Trapezoidal</SelectItem>
                    <SelectItem value="Triangular">Triangular</SelectItem>
                    <SelectItem value="Circular">Circular</SelectItem>
                    <SelectItem value="Other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topography">Topography</Label>
              <Select onValueChange={(value) => handleSelectChange("topography", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topography" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flat">Flat</SelectItem>
                  <SelectItem value="Sloping">Sloping</SelectItem>
                  <SelectItem value="Hilly">Hilly</SelectItem>
                  <SelectItem value="Rocky">Rocky</SelectItem>
                  <SelectItem value="Flood-Prone">Flood-Prone</SelectItem>
                  <SelectItem value="Swampy">Swampy</SelectItem>
                  <SelectItem value="Undulating">Undulating</SelectItem>
                  <SelectItem value="Valley">Valley</SelectItem>
                  <SelectItem value="Plateau">Plateau</SelectItem>
                  <SelectItem value="Mixed Terrain">Mixed Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Use and Access --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Use and Access</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentUse">Current Use</Label>
                <Select onValueChange={(value) => handleSelectChange("currentUse", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacant Land">Vacant Land</SelectItem>
                    <SelectItem value="Residential Building">Residential Building</SelectItem>
                    <SelectItem value="Commercial Activity">Commercial Activity</SelectItem>
                    <SelectItem value="Farming">Farming</SelectItem>
                    <SelectItem value="Industrial Operation">Industrial Operation</SelectItem>
                    <SelectItem value="Market Use">Market Use</SelectItem>
                    <SelectItem value="Educational Institution">Educational Institution</SelectItem>
                    <SelectItem value="Worship Centre">Worship Centre</SelectItem>
                    <SelectItem value="Public Utility">Public Utility</SelectItem>
                    <SelectItem value="Squatter Settlement">Squatter Settlement</SelectItem>
                    <SelectItem value="Encumbered">Encumbered / Disputed</SelectItem>
                    <SelectItem value="Other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposedUse">Proposed Use</Label>
                <Select onValueChange={(value) => handleSelectChange("proposedUse", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proposed use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Agricultural">Agricultural</SelectItem>
                    <SelectItem value="Institutional">Institutional</SelectItem>
                    <SelectItem value="Recreational">Recreational</SelectItem>
                    <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                    <SelectItem value="Public Utility">Public Utility</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Tourism">Tourism</SelectItem>
                    <SelectItem value="Undeclared">Undeclared</SelectItem>
                    <SelectItem value="Other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadAccess">Road Access</Label>
              <Select onValueChange={(value) => handleSelectChange("roadAccess", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select road access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tarred Road">Tarred Road</SelectItem>
                  <SelectItem value="Untarred Road">Untarred Road</SelectItem>
                  <SelectItem value="Paved Access Road">Paved Access Road</SelectItem>
                  <SelectItem value="Earth Road">Earth Road</SelectItem>
                  <SelectItem value="No Direct Access">No Direct Access</SelectItem>
                  <SelectItem value="Pedestrian Path Only">Pedestrian Path Only</SelectItem>
                  <SelectItem value="Proposed Road">Proposed Road (On Plan)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoningClassification">Zoning Classification</Label>
              <Select onValueChange={(value) => handleSelectChange("zoningClassification", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zoning classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential Zone">Residential Zone</SelectItem>
                  <SelectItem value="Commercial Zone">Commercial Zone</SelectItem>
                  <SelectItem value="Industrial Zone">Industrial Zone</SelectItem>
                  <SelectItem value="Agricultural Zone">Agricultural Zone</SelectItem>
                  <SelectItem value="Mixed-Use Zone">Mixed-Use Zone</SelectItem>
                  <SelectItem value="Institutional Zone">Institutional Zone</SelectItem>
                  <SelectItem value="Conservation Zone">Conservation / Green Zone</SelectItem>
                  <SelectItem value="Utility Zone">Utility / Infrastructure Zone</SelectItem>
                  <SelectItem value="Undefined">Undefined / Unzoned</SelectItem>
                  <SelectItem value="Other">Other (Specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "vehicle":
        return (
          <>
            {/* --- Vehicle Identification --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Vehicle Identification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => handleSelectChange("vehicleType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(vehicleTypes).map(([category, types]: [string, string[]]) => (
                      <SelectGroup key={category}>
                        <SelectLabel>{category.toUpperCase()}</SelectLabel>
                        {types.map((type: string) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="makeModel">Make & Model</Label>
                <Input
                  id="makeModel"
                  name="makeModel"
                  placeholder="e.g. Toyota Camry 2020"
                  value={formData.makeModel || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  placeholder="e.g. BEN 123 ABC"
                  value={formData.registrationNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Manufacture</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* --- Technical Specifications --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Technical Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select onValueChange={(value) => handleSelectChange("fuelType", value)} value={formData.fuelType}>
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                    <SelectItem value="lpg">LPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select onValueChange={(value) => handleSelectChange("transmission", value)} value={formData.transmission}>
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                    <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mileage">Current Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  placeholder="Enter current mileage"
                  value={formData.mileage || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="Enter vehicle color"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleCondition">Vehicle Condition</Label>
                <Select onValueChange={(value) => handleSelectChange("vehicleCondition", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="needs_repair">Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* --- Maintenance & Service --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Maintenance & Service</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastServiceDate">Last Service Date</Label>
                <Input
                  id="lastServiceDate"
                  name="lastServiceDate"
                  type="date"
                  value={formData.lastServiceDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextServiceDue">Next Service Due</Label>
                <Input
                  id="nextServiceDue"
                  name="nextServiceDue"
                  type="date"
                  value={formData.nextServiceDue || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* --- Insurance Details --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Insurance Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  placeholder="Enter insurance provider"
                  value={formData.insuranceProvider || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                <Input
                  id="insurancePolicyNumber"
                  name="insurancePolicyNumber"
                  placeholder="Enter policy number"
                  value={formData.insurancePolicyNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceExpiryDate">Insurance Expiry Date</Label>
              <Input
                id="insuranceExpiryDate"
                name="insuranceExpiryDate"
                type="date"
                value={formData.insuranceExpiryDate || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* --- Assignment & Location --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Assignment & Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedDepartment">Assigned Department</Label>
                <Input
                  id="assignedDepartment"
                  name="assignedDepartment"
                  placeholder="Enter assigned department"
                  value={formData.assignedDepartment || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedDriver">Assigned Driver</Label>
                <Input
                  id="assignedDriver"
                  name="assignedDriver"
                  placeholder="Enter assigned driver"
                  value={formData.assignedDriver || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingLocation">Regular Parking Location</Label>
              <Input
                id="parkingLocation"
                name="parkingLocation"
                placeholder="Enter regular parking location"
                value={formData.parkingLocation || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        )
      case "petroleum":
        return (
          <>
            {/* --- Facility Information --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Facility Information</h4>
            <div className="space-y-2">
              <Label htmlFor="facilityType">Facility Type</Label>
              <Select onValueChange={(value) => handleSelectChange("facilityType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filling_station">Filling Station</SelectItem>
                  <SelectItem value="depot">Depot</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="lpg_plant">LPG Plant</SelectItem>
                  <SelectItem value="lubricant_plant">Lubricant Plant</SelectItem>
                  <SelectItem value="aviation_fuel">Aviation Fuel Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityCapacity">Facility Capacity</Label>
                <Input
                  id="facilityCapacity"
                  name="facilityCapacity"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter capacity"
                  value={formData.facilityCapacity || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilityStatus">Facility Status</Label>
                <Select onValueChange={(value) => handleSelectChange("facilityStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="under_construction">Under Construction</SelectItem>
                    <SelectItem value="temporarily_closed">Temporarily Closed</SelectItem>
                    <SelectItem value="decommissioned">Decommissioned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* --- Storage & Equipment --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Storage & Equipment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalTanks">Total Number of Tanks</Label>
                <Input
                  id="totalTanks"
                  name="totalTanks"
                  type="number"
                  min="0"
                  value={formData.totalTanks || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPumps">Total Number of Pumps</Label>
                <Input
                  id="totalPumps"
                  name="totalPumps"
                  type="number"
                  min="0"
                  value={formData.totalPumps || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalDispensers">Total Number of Dispensers</Label>
                <Input
                  id="totalDispensers"
                  name="totalDispensers"
                  type="number"
                  min="0"
                  value={formData.totalDispensers || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalStorage">Total Storage Capacity (Liters)</Label>
                <Input
                  id="totalStorage"
                  name="totalStorage"
                  type="number"
                  min="0"
                  value={formData.totalStorage || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* --- Fuel Types --- */}
            <div className="space-y-2">
              <Label>Fuel Types Available</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Petrol", "Diesel", "Kerosene", "LPG", "CNG", "Aviation Fuel"].map((fuel) => (
                  <div key={fuel} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`fuel-${fuel.toLowerCase()}`}
                      checked={formData.fuelTypes?.includes(fuel) || false}
                      onChange={(e) => {
                        const currentFuels = formData.fuelTypes || [];
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            fuelTypes: [...currentFuels, fuel]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            fuelTypes: currentFuels.filter((f) => f !== fuel)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`fuel-${fuel.toLowerCase()}`}>{fuel}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Safety & Compliance --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Safety & Compliance</h4>
            <div className="space-y-2">
              <Label htmlFor="safetyCertification">Safety Certification</Label>
              <Select onValueChange={(value) => handleSelectChange("safetyCertification", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
                <Input
                  id="lastInspectionDate"
                  name="lastInspectionDate"
                  type="date"
                  value={formData.lastInspectionDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextInspectionDate">Next Inspection Date</Label>
                <Input
                  id="nextInspectionDate"
                  name="nextInspectionDate"
                  type="date"
                  value={formData.nextInspectionDate || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilityCondition">Facility Condition</Label>
              <Select onValueChange={(value) => handleSelectChange("facilityCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="needs_repair">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilityFeatures">Special Features</Label>
              <Textarea
                id="facilityFeatures"
                name="facilityFeatures"
                placeholder="Describe any special features or equipment"
                value={formData.facilityFeatures || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        )
      case "others":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="otherPropertySubtype">Equipment/Infrastructure Type</Label>
              <Select onValueChange={(value) => handleSelectChange("otherPropertySubtype", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment/infrastructure type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(equipmentAndInfrastructureTypes).map(([category, types]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.otherPropertySubtype && (
              <div className="space-y-4 mt-4">
                {/* Common Fields for All Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facilityCapacity">Capacity/Specifications</Label>
                    <Input
                      id="facilityCapacity"
                      name="facilityCapacity"
                      placeholder="Enter capacity or specifications"
                      value={formData.facilityCapacity || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilityStatus">Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("facilityStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="under_repair">Under Repair</SelectItem>
                        <SelectItem value="temporarily_closed">Temporarily Closed</SelectItem>
                        <SelectItem value="decommissioned">Decommissioned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Features/Contents Section */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold mb-4 text-gray-700">Features/Contents</h4>
                  
                  {/* Display Added Features */}
                  {formData.equipmentList && formData.equipmentList.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {formData.equipmentList.map((equipment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <span className="text-sm text-gray-800">
                            {equipment.name}: {equipment.quantity} ({equipment.condition})
                          </span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 h-6 px-2"
                            onClick={() => {
                              const newList = [...formData.equipmentList!];
                              newList.splice(index, 1);
                              setFormData(prev => ({
                                ...prev,
                                equipmentList: newList
                              }));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input for Adding New Feature */}
                  <div className="flex items-end gap-3">
                    <div className="flex-grow space-y-1">
                      <Label htmlFor="feature-name" className="text-xs">Feature Name</Label>
                      <Input
                        id="feature-name"
                        placeholder="e.g., Server Model, Generator Type"
                        value={newFeatureName}
                        onChange={handleFeatureNameChange}
                        className="h-9"
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label htmlFor="feature-quantity" className="text-xs">Quantity</Label>
                      <Input
                        id="feature-quantity"
                        type="number"
                        min="1"
                        value={newFeatureQuantity}
                        onChange={handleFeatureQuantityChange}
                        className="h-9"
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <Label htmlFor="feature-condition" className="text-xs">Condition</Label>
                      <Select value={newFeatureCondition} onValueChange={handleFeatureConditionChange}>
                        <SelectTrigger id="feature-condition" className="h-9">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleAddFeature} 
                      className="h-9"
                      disabled={!newFeatureName.trim() || !newFeatureQuantity.trim() || !newFeatureCondition}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>

                {/* Maintenance Schedule */}
                <div className="mt-6 space-y-4">
                  <h5 className="text-sm font-medium text-gray-700">Maintenance Schedule</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
                      <Input
                        id="lastInspectionDate"
                        name="lastInspectionDate"
                        type="date"
                        value={formData.lastInspectionDate || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextInspectionDate">Next Inspection Date</Label>
                      <Input
                        id="nextInspectionDate"
                        name="nextInspectionDate"
                        type="date"
                        value={formData.nextInspectionDate || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mt-6 space-y-2">
                  <Label htmlFor="facilityFeatures">Additional Notes</Label>
                  <Textarea
                    id="facilityFeatures"
                    name="facilityFeatures"
                    placeholder="Add any additional details about the equipment or infrastructure"
                    value={formData.facilityFeatures || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </>
        )
      default:
        return null
    }
  }

 

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Property Registration</h2>
        <p className="text-gray-500">Register a new government property in the system</p>
        
        {/* Display Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-2xl font-bold text-gray-900">₦{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Properties by Type</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">Houses: {stats.propertiesByType.house}</p>
                <p className="text-sm">Lands: {stats.propertiesByType.land}</p>
                <p className="text-sm">Vehicles: {stats.propertiesByType.vehicle}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Properties by State</h3>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.propertiesByState).length}</p>
              <p className="text-sm text-gray-500">States with registered properties</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[
          { num: 1, title: "Property Type" },
          { num: 2, title: "Location Details" },
          { num: 3, title: "Documentation" },
          { num: 4, title: "Confirmation" },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= s.num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s.num ? <Check className="h-5 w-5" /> : s.num}
            </div>
            <div className="text-xs text-center hidden sm:block">
              <p className={step >= s.num ? "font-medium text-blue-600" : "text-gray-500"}>{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className="border-blue-100">
        {/* Step 1: Property Type */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Select Property Type</CardTitle>
              <CardDescription>Choose the category that best describes this property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "house", icon: Building2, label: "House/Building" },
                  { id: "land", icon: MapPin, label: "Land/Plot" },
                  { id: "vehicle", icon: Truck, label: "Vehicle" },
                  { id: "institutions", icon: House, label: "Schools / Institutions" },
                  { id: "petroleum", icon: Fuel, label: "Petrol,Oil & Gas stations" },
                  { id: "others", icon: Beaker, label: "Others" },
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleSelectChange("propertyType", type.id)}
                    className={`border rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-colors ${
                      formData.propertyType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <type.icon
                      className={`h-12 w-12 mb-4 ${formData.propertyType === type.id ? "text-primary" : "text-gray-400"}`}
                    />
                    <h3 className="font-medium">{type.label}</h3>
                    <p className="text-sm text-gray-500 mt-2">Register a government {type.label.toLowerCase()}</p>
                  </div>
                ))}
              </div>

              {formData.propertyType && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-name">Property Name/Title</Label>
                    <Input
                      id="property-name"
                      name="propertyName"
                      placeholder="Enter official property name"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property-description">Brief Description</Label>
                    <Textarea
                      id="property-description"
                      name="description"
                      placeholder="Provide a short description of the property"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acquisition-date">Acquisition Date</Label>
                      <Input
                        id="acquisition-date"
                        name="acquisitionDate"
                        type="date"
                        value={formData.acquisitionDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-value">Estimated Value (₦)</Label>
                      <Input
                        id="estimated-value"
                        name="estimatedValue"
                        type="number"
                        placeholder="0.00"
                        value={formData.estimatedValue}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {renderPropertySpecificFields()}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Back
              </Button>
              <Button 
                onClick={() => setStep(step + 1)} 
                disabled={!validateStep(1, formData, propertyPhotos)} 
                className="bg-primary hover:bg-primary/90"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {/* Step 2: Location Details */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Specify where the property is located</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select onValueChange={(value) => {
                    handleSelectChange("state", value);
                    // Reset LGA when state changes
                    setFormData(prev => ({ ...prev, lga: "" }));
                  }}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(stateLGAs).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lga">Local Government Area</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("lga", value)}
                    disabled={!formData.state}
                  >
                    <SelectTrigger id="lga">
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state && stateLGAs[formData.state]?.map((lga) => (
                        <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter complete property address"
                  value={formData.address}
                  onChange={handleInputChange}
                  
                />
              </div>

              <div className="space-y-4">
              <Label>Search to get Longitude & Latitude</Label>

                <div className="flex items-center justify-between">

                  <MapWithMarkers state={formData.state} />{formData.state}
                </div>
                {locationError && (
                  <p className="text-sm text-red-500">{locationError}</p>
                )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      placeholder="e.g. 9.0765"
                      value={formData.latitude || ""}
                      onChange={handleInputChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      placeholder="e.g. 7.3986"
                      value={formData.longitude || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label>Map Location</Label>
                <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
                  {formData.latitude && formData.longitude ? (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCYei1fQhBU6k7pj5aIc0iHa8xOqBmk7Uk&q=${formData.latitude},${formData.longitude}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <p className="text-muted-foreground">Enter coordinates to view map</p>
                  )}
                </div>
              </div> */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(step + 1)} 
                disabled={!validateStep(2, formData, propertyPhotos)}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {/* Step 3: Documentation */}
        {step === 3 && (
          <>
          
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Upload required documents and images</CardDescription>
            </CardHeader>

            <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {/* ...client side upload component goes here */}
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">Property Deed/Certificate</h3>
                  </div>
                  <div className="border border-dashed rounded-lg p-6 bg-white flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse (PDF Only)</p>
                    <p className="text-xs text-gray-500">PDF (Max. 10MB)</p>
                
          <IKUpload
          id="property-deed"
          className="hidden"
          multiple={false}
          validateFile={(file) => {
            // Check if the file size is less than 2MB and the file type is PDF
            return file.size < 2000000 && file.type === "application/pdf";
          }}
          onUploadProgress={onPdeedsUploadProgress}
          folder={"/benue-government-properties/deeds"}
          fileName="test-upload.png"
          onError={onPdeedsError}
          onSuccess={onPdeedsSuccess}
        />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      type="button"
                      disabled={uploading || false}
                      onClick={() =>  document.getElementById("property-deed")?.click()}
                    >
                      Select File
                    </Button>
                    {uploading &&  <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>}
                    <div  className="flex flex-row space-x-4 mt-4 w-full overflow-x-scroll whitespace-nowrap bg-gray-100 p-4 scroll-smooth">
                      {propertyDeeds?.map((image, index) => (
                        <div key={index} className="relative">
                          <iframe
                            src={image}
                            className="w-500 h-500"
                          ></iframe>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 bg-red-500/80 hover:bg-red-500 text-white"
                            onClick={() => handleRemoveDeed(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/*           
                                  <img key={index} className="w-72 h-62 object-contain"  src={image}  style={{ maxHeight:200,maxWidth:200, borderRadius:5,borderWidth:0.9,borderColor:"#000"}} alt={`Property Deed ${index + 1}`} height={200} width={200} />
 */}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center mb-2">
                    <Upload className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">Property Images</h3>
                  </div>
                  <div className="border border-dashed rounded-lg p-6 bg-white flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload at least 3 images of the property</p>
                    <p className="text-xs text-gray-500">JPG or PNG (Max. 5MB each)</p>
                  


                    <IKUpload
                    id="property-images"
                    className="hidden"
                    multiple={false}
                    onUploadProgress={onIdeedsUploadProgress}
                    folder={"/benue-government-properties/Images"}
                    fileName="test-upload.png"
                    onError={onIdeedsError}
                    onSuccess={onIdeedsSuccess}
                  /> 
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="mt-4"
                      onClick={() => document.getElementById("property-images")?.click()}
                    >
                      Select Images
                    </Button>

                    {iuploading &&  <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>}
                    <div  className="flex flex-row space-x-4 mt-4 w-full overflow-x-scroll whitespace-nowrap bg-gray-100 p-4 scroll-smooth">
                      {propertyPhotos?.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            className="w-72 h-62 object-contain" 
                            src={image} 
                            style={{ maxHeight:200, maxWidth:200, borderRadius:5, borderWidth:0.9, borderColor:"#000"}} 
                            alt={`Property Image ${index + 1}`} 
                            height={200} 
                            width={200} 
                          />
                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 bg-red-500/80 hover:bg-red-500 text-white"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">Additional Documents (Optional)</h3>
                  </div>
                  <div className="border border-dashed rounded-lg p-6 bg-white flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload any additional supporting documents</p>
                    <p className="text-xs text-gray-500">PDF, DOC, XLS (Max. 20MB total)</p>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      multiple
                      onChange={(e) => handleFileChange(e, "additionalDocuments")}
                      className="hidden"
                      id="additional-documents"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => document.getElementById("additional-documents")?.click()}
                    >
                      Select Files
                    </Button>
                  </div>
                </div> */}
              </div>
            </CardContent>
      </IKContext>
        


            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button 
                disabled={!validateStep(3, formData, propertyPhotos)} 
                onClick={() => setStep(step + 1)}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle>Confirmation</CardTitle>
              <CardDescription>Review and confirm property details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-6 bg-blue-50 border-blue-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-blue-800"> {formData.propertyId}</h3>
                    <p className="text-sm text-blue-600">New Property Registration</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <QrCode className="h-16 w-16 text-blue-800" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Property Type</p>
                      <p className="text-sm">
                        {formData.propertyType === "house"
                          ? "House/Building"
                          : formData.propertyType === "land"
                            ? "Land/Plot":formData.propertyType === "institutions"
                            ? "Institutions":formData.propertyType === "petroleum"
                            ? "Petroleum,Gas & Oil"
                            : "Vehicle"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Registration Date</p>
                      <p className="text-sm">
                        {
                          new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }).format(new Date())
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-blue-600 font-medium">Location</p>
                    <p className="text-sm">
                      {formData.state}, {formData.lga}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-blue-600 font-medium">Registered By</p>
                    <p className="text-sm">Administrator (ID: FGN-2023-001)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any additional notes about this property"
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={formData.confirmed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmed: e.target.checked }))}
                  className="mt-1"
                />
                <Label htmlFor="confirm" className="text-sm">
                  I confirm that all information provided is accurate and complete. This property belongs to the Benue State
                  Government of Nigeria and is being registered in accordance with the Asset Management regulations.
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={!validateStep(4, formData, propertyPhotos) || isLoading} 
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Submitting..." : "Complete Registration"}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </form>
  )
}

