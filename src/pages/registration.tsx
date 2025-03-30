"use client"

import { useState, useEffect } from "react"
import { Building2, Check, ChevronRight, FileText, House, MapPin, QrCode, Truck, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { IKContext, IKUpload } from 'imagekitio-react';

interface FormData {
  // Basic Information
  propertyType: string
  propertyName: string
  description: string
  acquisitionDate: string
  estimatedValue: string

  // Property Specific Fields
  buildingType?: string
  floorCount?: string
  totalArea?: string
  yearBuilt?: string
  buildingCondition?: string

  landType?: string
  landSize?: string
  landCondition?: string
  landUse?: string

  vehicleType?: string
  makeModel?: string
  year?: string
  registrationNumber?: string
  vin?: string
  engineNumber?: string
  vehicleCondition?: string
  propertyId?:String

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

const urlEndpoint = 'https://ik.imagekit.io/pickwave';
const publicKey = 'public_GRAeK3J+pcYvdtIf27vrbGeirbs='; 
const authenticator =  async () => {
    try {
        const response = await axios.post('http://13.60.216.170:8000/api/auth/imagekit/auth');

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
    propertyType: "",
    propertyName: "",
    description: "",
    acquisitionDate: "",
    estimatedValue: "",
    state: "",
    lga: "",
    address: "",
    confirmed: false,
    propertyId: ""
  })

  // Function to fetch property statistics
  const fetchPropertyStats = async () => {
    try {
      const token = localStorage.getItem("token")
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
    fetchPropertyStats()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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

     // const formDataToSend = new FormData()
      

      // Append all form fields
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (value !== undefined && value !== null) {
      //     if (Array.isArray(value)) {
      //       // Handle array of files
      //       value.forEach((file, index) => {
      //         formDataToSend.append(`${key}[${index}]`, file)
      //       })
      //     } else if (value instanceof File) {
      //       // Handle single file
      //       formDataToSend.append(key, value)
      //     } else {
      //       // Handle other values
      //       formDataToSend.append(key, value.toString())
      //     }
      //   }
      // })
   

      //alert(JSON.stringify(formData))

      // Add authorization header if token exists
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      console.error(JSON.stringify(formData))
      
      await axios.post(
        "https://bdicisp.onrender.com/api/v1/properties/collection",
        formData,
        { headers }
      ).then((resp)=>{
        if(resp.data){
          alert("Registration successful....")
          navigate("/dashboard")
        }
        else{
          console.error(resp.data.message || "Registration failed")
        }
      }).catch((err)=>{
        console.error("Registration error:", err)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            navigate("/login")
          } else if (err.response?.status === 400) {
            // Handle validation errors
          } else if (err.response?.status === 500) {
            // Handle server errors
          }
        }
      })

    } catch (err) {
      console.error("Registration error:", err)
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          navigate("/login")
        } else if (err.response?.status === 400) {
          // Handle validation errors
        } else if (err.response?.status === 500) {
          // Handle server errors
        }
      }
    } finally {
      setIsLoading(false)
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



  const renderPropertySpecificFields = () => {
    switch (formData.propertyType) {
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
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
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
              <Select onValueChange={(value) => handleSelectChange("buildingCondition", value)}>
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
          </>
        )
      case "land":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="landType">Land Type</Label>
              <Select onValueChange={(value) => handleSelectChange("landType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="landSize">Land Size (hectares)</Label>
              <Input
                id="landSize"
                name="landSize"
                type="number"
                min="0"
                step="0.01"
                value={formData.landSize || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landCondition">Land Condition</Label>
              <Select onValueChange={(value) => handleSelectChange("landCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developed">Developed</SelectItem>
                  <SelectItem value="undeveloped">Undeveloped</SelectItem>
                  <SelectItem value="partially">Partially Developed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="landUse">Current Land Use</Label>
              <Select onValueChange={(value) => handleSelectChange("landUse", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="leased">Leased</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "vehicle":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select onValueChange={(value) => handleSelectChange("vehicleType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
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
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
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
                </SelectContent>
              </Select>
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { id: "house", icon: Building2, label: "House/Building" },
                  { id: "land", icon: MapPin, label: "Land/Plot" },
                  { id: "vehicle", icon: Truck, label: "Vehicle" },
                  { id: "others", icon: House, label: "School / Fuel stations etc" },
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
                      <SelectItem value="abuja">Federal Capital Territory</SelectItem>
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
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (optional)</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="e.g. 9.0765"
                    value={formData.latitude || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (optional)</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="e.g. 7.3986"
                    value={formData.longitude || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Map Location</Label>
                <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Interactive map will be displayed here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button onClick={() => setStep(step + 1)} disabled={!formData.state  || !formData.address}>
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
                            ? "Land/Plot"
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

