"use client"

import { useState, useEffect } from "react"
import {  useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Building2, Car, Landmark, FileText, Calendar, X, Home, Banknote, Tag, Fuel, School, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Property {
  _id: string
  propertyType: string
  propertyId: string
  propertyName: string
  description: string
  acquisitionDate: string
  estimatedValue: number
  buildingFeatures: { name: string; quantity: number; condition: string }[]
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
  createdAt: string
  notes?: string
  location?: {
    address: string
    latitude?: number
    longitude?: number
  }

  // Building properties
  buildingType?: string
  floorCount?: number
  totalArea?: number
  yearBuilt?: number
  buildingCondition?: string
  currentBuildingUse?: string

  // Vehicle properties
  vehicleType?: string
  makeModel?: string
  year?: number
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
  assignedDriver?: string
  assignedDepartment?: string
  parkingLocation?: string

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

  // Petroleum specific fields
  stationType?: string
  storageCapacity?: number
}


export default function PropertyView() {
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null)

  function getPropertyIdFromUrl() {
    const path = window.location.pathname; // "/property/67e452fed9831a0573a9a94a"
    const parts = path.split('/'); // ["", "property", "67e452fed9831a0573a9a94a"]
    return parts[parts.length - 1]; // Get the last part
  }
  const id = getPropertyIdFromUrl();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID not found in URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/admin/securelogin/login/"); // Redirect if no token
          return;
        }

        const response = await axios.get(
          `https://bdicisp.onrender.com/api/v1/properties/collection/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.data && response.data.data && response.data.data.property) {
           setProperty(response.data.data.property)
        } else {
            setError("Property data not found in the expected format.");
        }

      } catch (err) {
        console.error("Fetch error:", err); // Log the full error
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Unauthorized. Please log in again.");
            navigate("/login")
          } else if (err.response?.status === 404) {
              setError("Property not found.");
          } else {
            setError(err.response?.data?.message || `Failed to fetch property details (Status: ${err.response?.status})`);
          }
        } else {
          setError("An unexpected error occurred while fetching property details.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, navigate])

  const formatCurrency = (value: number | undefined) => {
      if (value === undefined) return "N/A";
      return `₦${value.toLocaleString()}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                 <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-red-500 mb-4">{error || "Property details could not be loaded."}</p>
                 <Button onClick={() => navigate("/database")}>Back to Database</Button>
            </CardContent>
        </Card>
      </div>
    )
  }

  const renderPropertyDetails = () => {
    switch (property?.propertyType) {
      case "institutions":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Institution Type</Label>
                <p className="text-sm">{property.institutionType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Institution Level</Label>
                <p className="text-sm">{property.institutionLevel}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Institution Name</Label>
                <p className="text-sm">{property.institutionName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Year Established</Label>
                <p className="text-sm">{property.yearEstablished}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Students</Label>
                <p className="text-sm">{property.totalStudents}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Staff</Label>
                <p className="text-sm">{property.totalStaff}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Classrooms</Label>
                <p className="text-sm">{property.totalClassrooms}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Laboratories</Label>
                <p className="text-sm">{property.totalLaboratories}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Offices</Label>
                <p className="text-sm">{property.totalOffices}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Toilets</Label>
                <p className="text-sm">{property.totalToilets}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Hostels</Label>
                <p className="text-sm">{property.totalHostels}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Libraries</Label>
                <p className="text-sm">{property.totalLibraries}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Auditoriums</Label>
                <p className="text-sm">{property.totalAuditoriums}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Sports Facilities</Label>
                <p className="text-sm">{property.totalSportsFacilities}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Institution Condition</Label>
                <p className="text-sm">{property.institutionCondition}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Institution Status</Label>
                <p className="text-sm">{property.institutionStatus}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Special Features</Label>
              <p className="text-sm">{property.institutionFeatures}</p>
            </div>
          </div>
        )
      case "house":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Building Type</Label>
                <p className="text-sm">{property.buildingType || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Floors</Label>
                <p className="text-sm">{property.floorCount ?? "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Area (sqm)</Label>
                <p className="text-sm">{property.totalArea ?? "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Year Built</Label>
                <p className="text-sm">{property.yearBuilt ?? "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Condition</Label>
                <p className="text-sm">{property.buildingCondition ? property.buildingCondition.charAt(0).toUpperCase() + property.buildingCondition.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Current Use</Label>
                <p className="text-sm">{property.currentBuildingUse ? property.currentBuildingUse.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "N/A"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Features/Contents</Label>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                {property.buildingFeatures?.map((feature, index) => (
                  <li key={index}>{feature.name}: {feature.quantity} ({feature.condition})</li>
                ))}
              </ul>
            </div>
          </div>
        )
      case "vehicle":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Vehicle Type</Label>
                <p className="text-sm">{property.vehicleType || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Make & Model</Label>
                <p className="text-sm">{property.makeModel || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Year</Label>
                <p className="text-sm">{property.year ?? "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Reg Number</Label>
                <p className="text-sm">{property.registrationNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">VIN</Label>
                <p className="text-sm">{property.vin || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Engine No</Label>
                <p className="text-sm">{property.engineNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Condition</Label>
                <p className="text-sm">{property.vehicleCondition ? property.vehicleCondition.charAt(0).toUpperCase() + property.vehicleCondition.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Color</Label>
                <p className="text-sm">{property.color || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Seating Capacity</Label>
                <p className="text-sm">{property.seatingCapacity || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Purchase Price</Label>
                <p className="text-sm">{formatCurrency(Number(property.purchasePrice))}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Fuel Type</Label>
                <p className="text-sm">{property.fuelType ? property.fuelType.charAt(0).toUpperCase() + property.fuelType.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Transmission</Label>
                <p className="text-sm">{property.transmission ? property.transmission.charAt(0).toUpperCase() + property.transmission.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Mileage</Label>
                <p className="text-sm">{property.mileage ? `${property.mileage} km` : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Last Service Date</Label>
                <p className="text-sm">{property.lastServiceDate ? new Date(property.lastServiceDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Next Service Due</Label>
                <p className="text-sm">{property.nextServiceDue ? new Date(property.nextServiceDue).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Assigned Driver</Label>
                <p className="text-sm">{property.assignedDriver || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Assigned Department</Label>
                <p className="text-sm">{property.assignedDepartment || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Parking Location</Label>
                <p className="text-sm">{property.parkingLocation || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Insurance Provider</Label>
                <p className="text-sm">{property.insuranceProvider || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Insurance Policy No</Label>
                <p className="text-sm">{property.insurancePolicyNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Insurance Expiry</Label>
                <p className="text-sm">{property.insuranceExpiryDate ? new Date(property.insuranceExpiryDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}</p>
              </div>
            </div>
          </div>
        )
      case "petroleum":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Station Type</Label>
                <p className="text-sm">{property.stationType || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Storage Capacity (L)</Label>
                <p className="text-sm">{property.storageCapacity?.toLocaleString() ?? "N/A"}</p>
              </div>
            </div>
          </div>
        )
      case "land":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Land Type</Label>
                <p className="text-sm">{property.landType || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Land Size</Label>
                <p className="text-sm">{property.landSize ? `${property.landSize} ${property.landSizeUnit || 'hectares'}` : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Condition</Label>
                <p className="text-sm">{property.landCondition ? property.landCondition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Current Use</Label>
                <p className="text-sm">{property.landUse ? property.landUse.charAt(0).toUpperCase() + property.landUse.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Plot Number</Label>
                <p className="text-sm">{property.plotNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Survey Plan No</Label>
                <p className="text-sm">{property.surveyPlanNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Layout Name</Label>
                <p className="text-sm">{property.layoutName || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Block Number</Label>
                <p className="text-sm">{property.blockNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Beacon Numbers</Label>
                <p className="text-sm">{property.beaconNumbers || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Perimeter</Label>
                <p className="text-sm">{property.perimeter ? `${property.perimeter} meters` : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Shape</Label>
                <p className="text-sm">{property.shape ? property.shape.charAt(0).toUpperCase() + property.shape.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Topography</Label>
                <p className="text-sm">{property.topography ? property.topography.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Zoning Classification</Label>
                <p className="text-sm">{property.zoningClassification ? property.zoningClassification.charAt(0).toUpperCase() + property.zoningClassification.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Title Type</Label>
                <p className="text-sm">{property.titleType === 'c_of_o' ? 'Certificate of Occupancy' : property.titleType ? property.titleType.toUpperCase() : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Title Reference No</Label>
                <p className="text-sm">{property.titleReferenceNumber || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Easements</Label>
                <p className="text-sm">{property.easements || "None"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Proposed Use</Label>
                <p className="text-sm">{property.proposedUse || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Road Access</Label>
                <p className="text-sm">{property.roadAccess ? property.roadAccess.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "N/A"}</p>
              </div>
              {property.utilityAccess && property.utilityAccess.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Utility Access</Label>
                  <div className="flex flex-wrap gap-1">
                    {property.utilityAccess.map((utility, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {utility}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Property Name</Label>
                <p className="text-sm">{property.propertyName || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Type</Label>
                <p className="text-sm">{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Estimated Value</Label>
                <p className="text-sm">{formatCurrency(property.estimatedValue)}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Acquisition Date</Label>
                <p className="text-sm">{property.acquisitionDate ? new Date(property.acquisitionDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">State</Label>
                <p className="text-sm">{property.state ? property.state.charAt(0).toUpperCase() + property.state.slice(1) : "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Address</Label>
                <p className="text-sm">{property.address ? property.address.charAt(0).toUpperCase() + property.address.slice(1) : "N/A"}</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => navigate("/database")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{property.propertyName || "Property Details"}</h2>
            <p className="text-sm text-gray-500">ID: {property.propertyId ?? property._id}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => navigate(`/edit/property/${id}`)}
        >
          Edit Property
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                  {property.propertyImages && property.propertyImages.length > 0 ? (
                    <img
                      src={selectedImage || property.propertyImages[0]}
                      alt={property.propertyName || property.propertyType}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(selectedImage || property.propertyImages[0])}
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Building2 className="h-16 w-16" />
                    </div>
                  )}
                </div>

                {property.propertyImages && property.propertyImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.propertyImages.map((image, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${ 
                          (selectedImage === image || (!selectedImage && index === 0))
                            ? "border-emerald-500"
                            : "border-transparent"
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(property.propertyDeed || property.additionalDocuments) && (property.propertyDeed?.length || 0) + (property.additionalDocuments?.length || 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Attached property documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.propertyDeed?.map((docUrl, index) => (
                  <button
                    key={`deed-${index}`}
                    onClick={() => setSelectedPdfUrl(docUrl)}
                    className="w-full flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-left"
                  >
                    <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-blue-600 truncate">Property Deed/Certificate {index + 1}</span>
                  </button>
                ))}
                 {property.additionalDocuments?.map((docUrl, index) => (
                  <a
                    key={`add-${index}`}
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-blue-600 truncate">Additional Document {index + 1}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div className="flex items-start space-x-2">
                 <Home className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-gray-600">Property Name:</span>
                   <p className="text-gray-800">{property.propertyName || "N/A"}</p>
                 </div>
               </div>
               <div className="flex items-start space-x-2">
                 {property.propertyType === "house" ? <Building2 className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  : property.propertyType === "vehicle" ? <Car className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  : property.propertyType === "land" ? <Landmark className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  : property.propertyType === "institutions" ? <School className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  : property.propertyType === "petroleum" ? <Fuel className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  : <Info className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />}
                 <div>
                   <span className="font-medium text-gray-600">Type:</span>
                   <p className="text-gray-800">{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</p>
                 </div>
               </div>
               <div className="flex items-start space-x-2">
                 <Banknote className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-gray-600">Estimated Value:</span>
                   <p className="text-gray-800">{formatCurrency(property.estimatedValue)}</p>
                 </div>
               </div>
               <div className="flex items-start space-x-2">
                 <Calendar className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-gray-600">Acquisition Date:</span>
                   <p className="text-gray-800">
                     {property.acquisitionDate ? new Date(property.acquisitionDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                   </p>
                 </div>
               </div>
               <div className="flex items-start space-x-2">
                 <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-gray-600">State:</span>
                   <p className="text-gray-800">{property.state ? property.state.charAt(0).toUpperCase() + property.state.slice(1) : "N/A"}</p>
                 </div>
               </div>
               <div className="flex items-start space-x-2 md:col-span-2">
                 <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-gray-600">Address:</span>
                   <p className="text-gray-800">{property.address ? property.address.charAt(0).toUpperCase() + property.address.slice(1) : "N/A"}</p>
                 </div>
               </div>
                <div className="flex items-start space-x-2">
                 <Calendar className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-gray-600">Registered On:</span>
                   <p className="text-gray-800">
                     {new Date(property.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                   </p>
                 </div>
               </div>
                <div className="flex items-start space-x-2">
                  <Tag className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  <div>
                     <span className="font-medium text-gray-600">Status:</span>
                     <p>
                      <Badge
                        className={`text-xs ${ 
                          property.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : property.status === "inactive"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }`}
                      >
                        {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : "Unknown"}
                      </Badge>
                    </p>
                  </div>
               </div>
             </CardContent>
           </Card>

           {/* Property Type Specific Details */}
           {property.propertyType && (
             <Card>
               <CardHeader>
                 <CardTitle>
                   {property.propertyType === "institutions" ? "Institution Details" :
                    property.propertyType === "house" ? "Building Details" :
                    property.propertyType === "vehicle" ? "Vehicle Details" :
                    property.propertyType === "petroleum" ? "Petroleum Station Details" :
                    property.propertyType === "land" ? "Land Details" : "Property Details"}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 {renderPropertyDetails()}
               </CardContent>
             </Card>
           )}

          {property.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {property.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{property.notes}</p>
              </CardContent>
            </Card>
          )}

        {(property.location?.address || property.location?.latitude || property.location?.longitude) && (
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  {property.location?.address && (<div>
                    <h3 className="font-medium mb-1 text-sm text-gray-600">Address</h3>
                    <p className="text-sm text-gray-800">{property.location.address}</p>
                  </div>)}
                  {(property.location?.latitude || property.location?.longitude) && (
                    <div>
                      <h3 className="font-medium mb-1 text-sm text-gray-600">Coordinates</h3>
                      <p className="text-sm text-gray-800">
                        {property.location.latitude && `Lat: ${property.location.latitude}`}
                        {property.location.latitude && property.location.longitude && ", "}
                        {property.location.longitude && `Lon: ${property.location.longitude}`}
                      </p>
                      {property.location.latitude && property.location.longitude && (
                           <a
                              href={`https://www.google.com/maps?q=${property.location.latitude},${property.location.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                          >
                              View on Google Maps
                          </a>
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
        )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-2">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/50 hover:bg-white/80 text-black"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="mt-0">
            <img
              src={selectedImage || ""}
              alt="Property preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPdfUrl} onOpenChange={() => setSelectedPdfUrl(null)}>
        <DialogContent className="max-w-4xl h-[85vh] p-2 flex flex-col">
          <DialogHeader className="flex-shrink-0 flex flex-row justify-between items-center space-x-2 p-2 border-b">
            <DialogTitle>Document Viewer</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedPdfUrl(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-grow mt-2 overflow-hidden"> 
            <iframe
              src={selectedPdfUrl || ""}
              title="PDF Document Viewer"
              className="w-full h-full border-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 