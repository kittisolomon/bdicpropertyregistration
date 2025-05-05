"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import axios from "axios"

interface Property {
  _id: string
  propertyType: string
  propertyId: string
  propertyName: string
  description: string
  acquisitionDate: string
  estimatedValue: number
  buildingFeatures: string[]
  landType: string
  landSize: number
  landCondition: string
  landUse: string
  state: string
  lga: string
  address: string
  coordinates: {
    latitude: string
    longitude: string
  }
  propertyDeed: string[]
  propertyImages: string[]
  additionalDocuments: string[]
  confirmed: boolean
  status: string
  plotNumber: string
  surveyPlanNumber: string
  layoutName: string
  blockNumber: string
  beaconNumbers: string
  landSizeUnit: string
  perimeter: string
  shape: string
  topography: string
  zoningClassification: string
  titleType: string
  titleReferenceNumber: string
  easements: string
  proposedUse: string
  roadAccess: string
  utilityAccess: string[]
  registrationNumber: string
  documents?: string[]
  // Institution specific fields
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
  registeredBy?: string
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

interface FormData {
  propertyType: string
  propertyName: string
  propertyId: string
  estimatedValue: number
  acquisitionDate: string
  status: string
  state: string
  lga: string
  address: string
  coordinates: {
    latitude: string
    longitude: string
  }
  description: string
  landType: string
  landSize: number
  landCondition: string
  landUse: string
  titleType: string
  titleReferenceNumber: string
  surveyPlanNumber: string
  beaconNumbers: string
  landSizeUnit: string
  vehicleType: string
  makeModel: string
  year: number
  vin: string
  engineNumber: string
  vehicleCondition: string
  color: string
  seatingCapacity: string
  purchasePrice: string
  fuelType: string
  transmission: string
  mileage: string
  lastServiceDate: string
  nextServiceDue: string
  insuranceProvider: string
  insurancePolicyNumber: string
  insuranceExpiryDate: string
  assignedDriver: string
  assignedDepartment: string
  parkingLocation: string
  buildingType: string
  floorCount: number
  totalArea: number
  yearBuilt: number
  currentBuildingUse: string
  buildingCondition: string
  buildingFeatures: string[]
  // Institution specific fields
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
  registeredBy?: string
}

export default function PropertyEdit() {
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    propertyName: "",
    propertyId: "",
    estimatedValue: 0,
    acquisitionDate: "",
    status: "",
    state: "",
    lga: "",
    address: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    description: "",
    landType: "",
    landSize: 0,
    landCondition: "",
    landUse: "",
    titleType: "",
    titleReferenceNumber: "",
    surveyPlanNumber: "",
    beaconNumbers: "",
    landSizeUnit: "hectares",
    vehicleType: "",
    makeModel: "",
    year: 0,
    vin: "",
    engineNumber: "",
    vehicleCondition: "",
    color: "",
    seatingCapacity: "",
    purchasePrice: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    lastServiceDate: "",
    nextServiceDue: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiryDate: "",
    assignedDriver: "",
    assignedDepartment: "",
    parkingLocation: "",
    buildingType: "",
    floorCount: 0,
    totalArea: 0,
    yearBuilt: 0,
    currentBuildingUse: "",
    buildingCondition: "",
    buildingFeatures: [],
    // Institution specific fields
    institutionType: "",
    institutionLevel: "",
    institutionName: "",
    yearEstablished: "",
    totalStudents: "",
    totalStaff: "",
    totalClassrooms: "",
    totalLaboratories: "",
    totalOffices: "",
    totalToilets: "",
    totalHostels: "",
    totalLibraries: "",
    totalAuditoriums: "",
    totalSportsFacilities: "",
    institutionCondition: "",
    institutionStatus: "",
    institutionFeatures: "",
    registeredBy: ""
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  function getPropertyIdFromUrl() {
    const path = window.location.pathname; // "/property/67e452fed9831a0573a9a94a"
    const parts = path.split('/'); // ["", "property", "67e452fed9831a0573a9a94a"]
    return parts[3]; // "67e452fed9831a0573a9a94a"
  }
  const id = getPropertyIdFromUrl();
  //alert(id)
  useEffect(() => {
    setIsDeleting(false)
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(
          `https://bdicisp.vercel.app/api/v1/properties/collection/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        //alert(JSON.stringify(response.data.data.property))
        const propertyData = response.data.data.property
        
        setProperty(propertyData)
        setFormData({
          propertyType: propertyData.propertyType,
          propertyName: propertyData.propertyName,
          propertyId: propertyData.propertyId,
          estimatedValue: propertyData.estimatedValue,
          acquisitionDate: propertyData.acquisitionDate,
          status: propertyData.status,
          state: propertyData.state,
          lga: propertyData.lga,
          address: propertyData.address,
          coordinates: {
            latitude: propertyData.coordinates.coordinates[1],
            longitude: propertyData.coordinates.coordinates[0],
          },
          description: propertyData.description || "",
          landType: propertyData.landType || "",
          landSize: propertyData.landSize || 0,
          landCondition: propertyData.landCondition || "",
          landUse: propertyData.landUse || "",
          titleType: propertyData.titleType || "",
          titleReferenceNumber: propertyData.titleReferenceNumber || "",
          surveyPlanNumber: propertyData.surveyPlanNumber || "",
          beaconNumbers: propertyData.beaconNumbers || "",
          landSizeUnit: propertyData.landSizeUnit || "hectares",
          vehicleType: propertyData.vehicleType || "",
          makeModel: propertyData.makeModel || "",
          year: propertyData.year || 0,
          vin: propertyData.vin || "",
          engineNumber: propertyData.engineNumber || "",
          vehicleCondition: propertyData.vehicleCondition || "",
          color: propertyData.color || "",
          seatingCapacity: propertyData.seatingCapacity || "",
          purchasePrice: propertyData.purchasePrice || "",
          fuelType: propertyData.fuelType || "",
          transmission: propertyData.transmission || "",
          mileage: propertyData.mileage || "",
          lastServiceDate: propertyData.lastServiceDate || "",
          nextServiceDue: propertyData.nextServiceDue || "",
          insuranceProvider: propertyData.insuranceProvider || "",
          insurancePolicyNumber: propertyData.insurancePolicyNumber || "",
          insuranceExpiryDate: propertyData.insuranceExpiryDate || "",
          assignedDriver: propertyData.assignedDriver || "",
          assignedDepartment: propertyData.assignedDepartment || "",
          parkingLocation: propertyData.parkingLocation || "",
          buildingType: propertyData.buildingType || "",
          floorCount: propertyData.floorCount || 0,
          totalArea: propertyData.totalArea || 0,
          yearBuilt: propertyData.yearBuilt || 0,
          currentBuildingUse: propertyData.currentBuildingUse || "",
          buildingCondition: propertyData.buildingCondition || "",
          buildingFeatures: propertyData.buildingFeatures || [],
          // Institution specific fields
          institutionType: propertyData.institutionType || "",
          institutionLevel: propertyData.institutionLevel || "",
          institutionName: propertyData.institutionName || "",
          yearEstablished: propertyData.yearEstablished || "",
          totalStudents: propertyData.totalStudents || "",
          totalStaff: propertyData.totalStaff || "",
          totalClassrooms: propertyData.totalClassrooms || "",
          totalLaboratories: propertyData.totalLaboratories || "",
          totalOffices: propertyData.totalOffices || "",
          totalToilets: propertyData.totalToilets || "",
          totalHostels: propertyData.totalHostels || "",
          totalLibraries: propertyData.totalLibraries || "",
          totalAuditoriums: propertyData.totalAuditoriums || "",
          totalSportsFacilities: propertyData.totalSportsFacilities || "",
          institutionCondition: propertyData.institutionCondition || "",
          institutionStatus: propertyData.institutionStatus || "",
          institutionFeatures: propertyData.institutionFeatures || "",
          registeredBy: propertyData.registeredBy || ""
        })
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            navigate("/login")
          } else {
            setError(err.response?.data?.message || "Failed to fetch property details")
          }
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      const submitData = {
        ...formData,
        coordinates: {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude,
        },
      }

      await axios.put(
        `https://bdicisp.vercel.app/api/v1/properties/${id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      navigate(`/property/${id}`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          navigate("/login")
        } else {
          setError(err.response?.data?.message || "Failed to update property")
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("coordinates.")) {
      const coordinateField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordinateField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('images', file)
      })

      const response = await axios.post(
        `https://bdicisp.vercel.app/api/v1/properties/${id}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (property) {
        setProperty({
          ...property,
          propertyImages: [...(property.propertyImages || []), ...response.data.data.images],
        })
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to upload images")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsUploading(false)
    }
  }
//   const authenticator =  async () => {
//     try {
//         const response = await axios.post('https://bdicisp.onrender.com/api/v1/auth/imagekit/auth');

//         if (!response.data) {
//             const errorText = await response.data;
//             throw new Error(`Request failed with status ${response.status}: ${errorText}`);
//         }

//         const data = await response.data;
//         const { signature, expire, token } = data;
//         return { signature, expire, token };
//     } catch (error) {
//         //throw new Error(`Authentication request failed: ${error.message}`);
//     }
// };
const urlEndpoint = 'https://ik.imagekit.io/bdic';
const publicKey = 'public_k/7VGHSYTH1q/STxZGOGFWUrsdE='
const authenticationEndpoint ="https://bdicisp.onrender.com/api/v1/auth/imagekit/auth"
const imagekitConfigOptions = { urlEndpoint,publicKey,authenticationEndpoint };
imagekitConfigOptions.publicKey = publicKey;
imagekitConfigOptions.authenticationEndpoint = authenticationEndpoint;

//const imagekit = new ImageKit(imagekitConfigOptions);
  // const handleDeleteImage = async (id: string,index:number,imageUrl:string) => {
  //   try {
  //     setIsDeleting(true)
    
  //     await axios.delete(
  //       `https://bdicisp.vercel.app/api/v1/properties/collection/${id}/images/${index}`,
  //       {
  //         headers: {
  //           "x-access-token": `Bearer ${localStorage.getItem("token")}`,
  //         }
  //       }
  //     )

  //     if (property) {
  //       setProperty({
  //         ...property,
  //         propertyImages: property.propertyImages?.filter(img => img !== imageUrl) || [],
  //       })
  //     }
  //     setSelectedImage(null)
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       setError(err.response?.data?.message || "Failed to delete image")
  //     } else {
  //       setError("An unexpected error occurred")
  //     }
  //   } finally {
  //     setIsDeleting(false)
  //   }
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error || "Property not found"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => navigate(`/property/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Property</h2>
            <p className="text-sm text-gray-500">ID: {property._id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, propertyType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="institutions">Institutions</SelectItem>
                    <SelectItem value="petroleum">Petroleum</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="Enter property name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyId">Property ID</Label>
                <Input
                  id="propertyId"
                  name="propertyId"
                  disabled
                  value={formData.propertyId}
                  onChange={handleChange}
                  placeholder="Enter property ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value (₦)</Label>
                <Input
                  id="estimatedValue"
                  name="estimatedValue"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="Enter estimated value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                <Input
                  id="acquisitionDate"
                  name="acquisitionDate"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Land Details - Only show when property type is land */}
          {formData.propertyType === "land" && (
            <Card>
              <CardHeader>
                <CardTitle>Land Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landType">Land Type</Label>
                  <Select
                    value={formData.landType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, landType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select land type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmland (Crop Cultivation)">Farmland (Crop Cultivation)</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="landSize">Land Size</Label>
                    <Input
                      id="landSize"
                      name="landSize"
                      type="number"
                      value={formData.landSize}
                      onChange={handleChange}
                      placeholder="Enter land size"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landSizeUnit">Unit</Label>
                    <Select
                      value={formData.landSizeUnit}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, landSizeUnit: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="square meters">Square Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landCondition">Land Condition</Label>
                  <Select
                    value={formData.landCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, landCondition: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select land condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undeveloped_cleared">Undeveloped (Cleared)</SelectItem>
                      <SelectItem value="undeveloped_wooded">Undeveloped (Wooded)</SelectItem>
                      <SelectItem value="partially_developed">Partially Developed</SelectItem>
                      <SelectItem value="fully_developed">Fully Developed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landUse">Land Use</Label>
                  <Select
                    value={formData.landUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, landUse: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select land use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farming">Farming</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleType">Title Type</Label>
                  <Select
                    value={formData.titleType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, titleType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c_of_o">Certificate of Occupancy</SelectItem>
                      <SelectItem value="r_of_o">Right of Occupancy</SelectItem>
                      <SelectItem value="deed">Deed</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleReferenceNumber">Title Reference Number</Label>
                  <Input
                    id="titleReferenceNumber"
                    name="titleReferenceNumber"
                    value={formData.titleReferenceNumber}
                    onChange={handleChange}
                    placeholder="Enter title reference number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surveyPlanNumber">Survey Plan Number</Label>
                  <Input
                    id="surveyPlanNumber"
                    name="surveyPlanNumber"
                    value={formData.surveyPlanNumber}
                    onChange={handleChange}
                    placeholder="Enter survey plan number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beaconNumbers">Beacon Numbers</Label>
                  <Input
                    id="beaconNumbers"
                    name="beaconNumbers"
                    value={formData.beaconNumbers}
                    onChange={handleChange}
                    placeholder="Enter beacon numbers (comma separated)"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Details - Only show when property type is vehicle */}
          {formData.propertyType === "vehicle" && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, vehicleType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="makeModel">Make & Model</Label>
                  <Input
                    id="makeModel"
                    name="makeModel"
                    value={formData.makeModel}
                    onChange={handleChange}
                    placeholder="Enter make and model"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="Enter year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Enter color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      placeholder="Enter VIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineNumber">Engine Number</Label>
                    <Input
                      id="engineNumber"
                      name="engineNumber"
                      value={formData.engineNumber}
                      onChange={handleChange}
                      placeholder="Enter engine number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleCondition">Condition</Label>
                  <Select
                    value={formData.vehicleCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, vehicleCondition: value }))
                    }
                  >
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, fuelType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, transmission: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="Enter mileage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                    <Input
                      id="seatingCapacity"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleChange}
                      placeholder="Enter seating capacity"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastServiceDate">Last Service Date</Label>
                    <Input
                      id="lastServiceDate"
                      name="lastServiceDate"
                      type="date"
                      value={formData.lastServiceDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextServiceDue">Next Service Due</Label>
                    <Input
                      id="nextServiceDue"
                      name="nextServiceDue"
                      type="date"
                      value={formData.nextServiceDue}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedDriver">Assigned Driver</Label>
                  <Input
                    id="assignedDriver"
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleChange}
                    placeholder="Enter assigned driver"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedDepartment">Assigned Department</Label>
                  <Input
                    id="assignedDepartment"
                    name="assignedDepartment"
                    value={formData.assignedDepartment}
                    onChange={handleChange}
                    placeholder="Enter assigned department"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parkingLocation">Parking Location</Label>
                  <Input
                    id="parkingLocation"
                    name="parkingLocation"
                    value={formData.parkingLocation}
                    onChange={handleChange}
                    placeholder="Enter parking location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    placeholder="Enter insurance provider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      name="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={handleChange}
                      placeholder="Enter policy number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceExpiryDate">Expiry Date</Label>
                    <Input
                      id="insuranceExpiryDate"
                      name="insuranceExpiryDate"
                      type="date"
                      value={formData.insuranceExpiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* House Details - Only show when property type is house */}
          {formData.propertyType === "house" && (
            <Card>
              <CardHeader>
                <CardTitle>House Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingType">Building Type</Label>
                  <Select
                    value={formData.buildingType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, buildingType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel / Motel">Hotel / Motel</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floorCount">Floor Count</Label>
                    <Input
                      id="floorCount"
                      name="floorCount"
                      type="number"
                      value={formData.floorCount}
                      onChange={handleChange}
                      placeholder="Enter floor count"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Total Area (sqm)</Label>
                    <Input
                      id="totalArea"
                      name="totalArea"
                      type="number"
                      value={formData.totalArea}
                      onChange={handleChange}
                      placeholder="Enter total area"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    placeholder="Enter year built"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentBuildingUse">Current Use</Label>
                  <Select
                    value={formData.currentBuildingUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currentBuildingUse: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leased_commercial">Leased (Commercial)</SelectItem>
                      <SelectItem value="leased_residential">Leased (Residential)</SelectItem>
                      <SelectItem value="government_use">Government Use</SelectItem>
                      <SelectItem value="vacant">Vacant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingCondition">Condition</Label>
                  <Select
                    value={formData.buildingCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, buildingCondition: value }))
                    }
                  >
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
              </CardContent>
            </Card>
          )}

          {/* Institution Details - Only show when property type is institutions */}
          {formData.propertyType === "institutions" && (
            <Card>
              <CardHeader>
                <CardTitle>Institution Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionType">Institution Type</Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionType: value }))
                    }
                  >
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
                  <Select
                    value={formData.institutionLevel}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionLevel: value }))
                    }
                  >
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

                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="Enter institution name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    name="yearEstablished"
                    type="number"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    placeholder="Enter year established"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalStudents">Total Students</Label>
                    <Input
                      id="totalStudents"
                      name="totalStudents"
                      type="number"
                      value={formData.totalStudents}
                      onChange={handleChange}
                      placeholder="Enter total students"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalStaff">Total Staff</Label>
                    <Input
                      id="totalStaff"
                      name="totalStaff"
                      type="number"
                      value={formData.totalStaff}
                      onChange={handleChange}
                      placeholder="Enter total staff"
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
                      value={formData.totalClassrooms}
                      onChange={handleChange}
                      placeholder="Enter total classrooms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalLaboratories">Total Laboratories</Label>
                    <Input
                      id="totalLaboratories"
                      name="totalLaboratories"
                      type="number"
                      value={formData.totalLaboratories}
                      onChange={handleChange}
                      placeholder="Enter total laboratories"
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
                      value={formData.totalOffices}
                      onChange={handleChange}
                      placeholder="Enter total offices"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalToilets">Total Toilets</Label>
                    <Input
                      id="totalToilets"
                      name="totalToilets"
                      type="number"
                      value={formData.totalToilets}
                      onChange={handleChange}
                      placeholder="Enter total toilets"
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
                      value={formData.totalHostels}
                      onChange={handleChange}
                      placeholder="Enter total hostels"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalLibraries">Total Libraries</Label>
                    <Input
                      id="totalLibraries"
                      name="totalLibraries"
                      type="number"
                      value={formData.totalLibraries}
                      onChange={handleChange}
                      placeholder="Enter total libraries"
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
                      value={formData.totalAuditoriums}
                      onChange={handleChange}
                      placeholder="Enter total auditoriums"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalSportsFacilities">Total Sports Facilities</Label>
                    <Input
                      id="totalSportsFacilities"
                      name="totalSportsFacilities"
                      type="number"
                      value={formData.totalSportsFacilities}
                      onChange={handleChange}
                      placeholder="Enter total sports facilities"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionCondition">Institution Condition</Label>
                  <Select
                    value={formData.institutionCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionCondition: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionStatus">Institution Status</Label>
                  <Select
                    value={formData.institutionStatus}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionStatus: value }))
                    }
                  >

                 
             
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution status" />
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
                    value={formData.institutionFeatures}
                    onChange={handleChange}
                    placeholder="Enter special features or unique attributes of the institution"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, state: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state.toLowerCase()}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <Input
                  id="lga"
                  name="lga"
                  value={formData.lga}
                  onChange={handleChange}
                  placeholder="Enter LGA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.coordinates.latitude}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coordinates: { ...prev.coordinates, latitude: e.target.value },
                      }))
                    }
                    placeholder="Enter latitude"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.coordinates.longitude}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coordinates: { ...prev.coordinates, longitude: e.target.value },
                      }))
                    }
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Property Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter property description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Upload or update property documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.documents && property.documents.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.documents.map((_doc, index) => (
                      <div
                        key={index}
                        className="flex  items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-600">Document {index + 1}</span>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          Remove  
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>


             {/* Property Images */}
             <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>Upload and manage property images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '500px' }}>
                  {property?.propertyImages && property.propertyImages.length > 0 ? (
                    <img
                      src={selectedImage || property.propertyImages[0]}
                      alt={property.propertyType}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                      onClick={() => {
                        if (property.propertyImages && property.propertyImages.length > 0) {
                          setSelectedImage(property.propertyImages[0])
                          setIsPreviewOpen(true)
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {property?.propertyImages && property.propertyImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.propertyImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative rounded-md overflow-hidden cursor-pointer border-2 flex items-center justify-center ${
                          selectedImage === image ? "border-primary" : "border-transparent"
                        }`}
                        style={{ height: '250px' }}
                      >
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                          onClick={() => {
                            setSelectedImage(image)
                            setIsPreviewOpen(true)
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 bg-red-500/80 hover:bg-red-500 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                           // handleDeleteImage(image)
                          }}
                          disabled={isDeleting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JPG, PNG, or GIF (MAX. 10MB)</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Property Image</DialogTitle>
          </DialogHeader>
          <div className="relative">
          
            <img
              src={selectedImage || ""}
              alt="Property preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
} 