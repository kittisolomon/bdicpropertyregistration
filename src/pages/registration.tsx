"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Plus, Trash2, Check, Building2, MapPin, Truck, Home as House, Fuel, Beaker, ChevronRight, FileText, Upload, QrCode } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IKContext, IKUpload } from 'imagekitio-react'
import axios from 'axios'
import { buildingTypes, landTypes, vehicleTypes } from "@/lib/constants"
import MapWithMarkers from "./MapWithMarkers"

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

    //setPropertyDeeds((prev)=> [...prev, res.url])
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

    //setPropertyDeeds((prev)=> [...prev, res.url])
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
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="polytechnic">Polytechnic</SelectItem>
                  <SelectItem value="collegeofeducation">College Of Education</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="NurseryPrimarySecondary">Nursery,Primary & Secondary School</SelectItem>
                  <SelectItem value="vocational">Vocational/Training Center</SelectItem>
                  <SelectItem value="special">Special Education School</SelectItem>
                  <SelectItem value="technical">Technical College</SelectItem>
                  <SelectItem value="research">Research Institute</SelectItem>
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
              <Label htmlFor="plotNumber">Plot Number</Label>
              <Input id="plotNumber" name="plotNumber" value={formData.plotNumber || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockNumber">Block Number (Optional)</Label>
              <Input id="blockNumber" name="blockNumber" value={formData.blockNumber || ""} onChange={handleInputChange} />
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="layoutName">Layout Name/Scheme</Label>
              <Input id="layoutName" name="layoutName" value={formData.layoutName || ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyPlanNumber">Survey Plan Number</Label>
              <Input id="surveyPlanNumber" name="surveyPlanNumber" value={formData.surveyPlanNumber || ""} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="beaconNumbers">Beacon Numbers (comma-separated)</Label>
              <Input id="beaconNumbers" name="beaconNumbers" value={formData.beaconNumbers || ""} onChange={handleInputChange} />
            </div>

             {/* --- Physical Attributes --- */}
             <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Physical Attributes</h4>
             <div className="space-y-2">
              <Label htmlFor="landType">Land Type</Label>
              <Select onValueChange={(value) => handleSelectChange("landType", value)} value={formData.landType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(landTypes).map(([category, types]: [string, string[]]) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="e.g. Silver Metallic"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                <Input
                  id="seatingCapacity"
                  name="seatingCapacity"
                  type="number"
                  min="1"
                  value={formData.seatingCapacity || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* --- Vehicle Identification --- */}
            <h4 className="text-md font-semibold mt-4 mb-2 text-gray-700 md:col-span-2">Vehicle Identification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  placeholder="e.g. ABC123XY"
                  value={formData.registrationNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">Vehicle ID Number (VIN)</Label>
                <Input
                  id="vin"
                  name="vin"
                  placeholder="Enter VIN"
                  value={formData.vin || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engineNumber">Engine Number</Label>
                <Input
                  id="engineNumber"
                  name="engineNumber"
                  placeholder="Enter engine number"
                  value={formData.engineNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter purchase price"
                  value={formData.purchasePrice || ""}
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
              <div className="space-y-2">
                <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                <Input
                  id="seatingCapacity"
                  name="seatingCapacity"
                  type="number"
                  min="1"
                  value={formData.seatingCapacity || ""}
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
      default:
        return null
    }
  }

  // const detectLocation = () => {
  //   setIsDetectingLocation(true)
  //   setLocationError(null)

  //   if (!navigator.geolocation) {
  //     setLocationError("Geolocation is not supported by your browser")
  //     setIsDetectingLocation(false)
  //     return
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setFormData((prev) => ({
  //         ...prev,
  //         latitude: position.coords.latitude.toString(),
  //         longitude: position.coords.longitude.toString(),
  //       }))
  //       setIsDetectingLocation(false)
  //     },
  //     (error) => {
  //       console.error("Error getting location:", error)
  //       setLocationError("Unable to detect your location. Please enter coordinates manually.")
  //       setIsDetectingLocation(false)
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 5000,
  //       maximumAge: 0,
  //     }
  //   )
  // }

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
              {/* <Button onClick={() => setStep(step + 1)} disabled={!formData.propertyType || !formData.propertyName || !formData.description  || !formData.acquisitionDate || !formData.estimatedValue || !formData.buildingType || !formData.buildingCondition} className="bg-primary hover:bg-primary/90">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button> */}

<Button onClick={() => setStep(step + 1)} disabled={!formData.propertyType   } className="bg-primary hover:bg-primary/90">
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
                  <Select onValueChange={(value) => handleSelectChange("state", value)}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fct">Federal Capital Territory</SelectItem>
                      <SelectItem value="abia">Abia</SelectItem>
                      <SelectItem value="adamawa">Adamawa</SelectItem>
                      <SelectItem value="akwa-ibom">Akwa Ibom</SelectItem>
                      <SelectItem value="anambra">Anambra</SelectItem>
                      <SelectItem value="bauchi">Bauchi</SelectItem>
                      <SelectItem value="bayelsa">Bayelsa</SelectItem>
                      <SelectItem value="benue">Benue</SelectItem>
                      <SelectItem value="borno">Borno</SelectItem>
                      <SelectItem value="cross-river">Cross River</SelectItem>
                      <SelectItem value="delta">Delta</SelectItem>
                      <SelectItem value="ebonyi">Ebonyi</SelectItem>
                      <SelectItem value="edo">Edo</SelectItem>
                      <SelectItem value="ekiti">Ekiti</SelectItem>
                      <SelectItem value="enugu">Enugu</SelectItem>
                      <SelectItem value="gombe">Gombe</SelectItem>
                      <SelectItem value="imo">Imo</SelectItem>
                      <SelectItem value="jigawa">Jigawa</SelectItem>
                      <SelectItem value="kaduna">Kaduna</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="katsina">Katsina</SelectItem>
                      <SelectItem value="kebbi">Kebbi</SelectItem>
                      <SelectItem value="kogi">Kogi</SelectItem>
                      <SelectItem value="kwara">Kwara</SelectItem>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="nasarawa">Nasarawa</SelectItem>
                      <SelectItem value="niger">Niger</SelectItem>
                      <SelectItem value="ogun">Ogun</SelectItem>
                      <SelectItem value="ondo">Ondo</SelectItem>
                      <SelectItem value="osun">Osun</SelectItem>
                      <SelectItem value="oyo">Oyo</SelectItem>
                      <SelectItem value="plateau">Plateau</SelectItem>
                      <SelectItem value="rivers">Rivers</SelectItem>
                      <SelectItem value="sokoto">Sokoto</SelectItem>
                      <SelectItem value="taraba">Taraba</SelectItem>
                      <SelectItem value="yobe">Yobe</SelectItem>
                      <SelectItem value="zamfara">Zamfara</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div style={{display:"none"}} className="space-y-2">
                  <Label htmlFor="lga">Local Government Area</Label>
                  <Select onValueChange={(value) => handleSelectChange("lga", value)}>
                    <SelectTrigger id="lga">
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abaji">Abaji</SelectItem>
                      <SelectItem value="bwari">Bwari</SelectItem>
                      <SelectItem value="gwagwalada">Gwagwalada</SelectItem>
                      <SelectItem value="kuje">Kuje</SelectItem>
                      <SelectItem value="kwali">Kwali</SelectItem>
                      <SelectItem value="municipal">Municipal</SelectItem>
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
              <Button onClick={() => setStep(step + 1)} disabled={!formData.state || !formData.address}>
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
                        <iframe
                        key={index}
                        src={image}
                        className="w-500 h-500"
                      ></iframe>
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
                 <img key={index} className="w-72 h-62 object-contain"  src={image}  style={{ maxHeight:200,maxWidth:200, borderRadius:5,borderWidth:0.9,borderColor:"#000"}} alt={`Property Deed ${index + 1}`} height={200} width={200} />

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
              <Button disabled={propertyPhotos.length < 3 } onClick={() => setStep(step + 1)}>
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
              <Button type="submit" disabled={!formData.confirmed || isLoading} className="bg-primary hover:bg-primary/90">
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

