"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

interface Property {
  _id: string
  propertyType: string
  state: string
  createdAt: string
  status: string
  image?: string
  description?: string
  location?: {
    address: string
    latitude?: number
    longitude?: number
  }
  documents?: string[]
}

export default function PropertyEdit() {
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    propertyType: "",
    state: "",
    description: "",
    location: {
      address: "",
      latitude: "",
      longitude: "",
    },
    status: "",
  })
  function getPropertyIdFromUrl() {
    const path = window.location.pathname; // "/property/67e452fed9831a0573a9a94a"
    const parts = path.split('/'); // ["", "property", "67e452fed9831a0573a9a94a"]
    return parts[3]; // "67e452fed9831a0573a9a94a"
  }
  const id = getPropertyIdFromUrl();
  //alert(id)
  useEffect(() => {
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
          state: propertyData.state,
          description: propertyData.description || "",
          location: {
            address: propertyData?.address || "",
            latitude: propertyData?.coordinates.coordinates[0]|| "",
            longitude: propertyData?.coordinates.coordinates[0] || "",
          },
          status: propertyData.status,
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

      await axios.put(
        `https://bdicisp.vercel.app/api/v1/properties/${id}`,
        formData,
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
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
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
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location.address">Address</Label>
                <Textarea
                  id="location.address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location.latitude">Latitude</Label>
                  <Input
                    id="location.latitude"
                    name="location.latitude"
                    type="number"
                    step="any"
                    value={formData.location.latitude}
                    onChange={handleChange}
                    placeholder="Enter latitude"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location.longitude">Longitude</Label>
                  <Input
                    id="location.longitude"
                    name="location.longitude"
                    type="number"
                    step="any"
                    value={formData.location.longitude}
                    onChange={handleChange}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 