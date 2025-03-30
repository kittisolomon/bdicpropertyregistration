"use client"

import { useState, useEffect } from "react"
import {  useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, SquareMenu, Building2, Car, Landmark, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

interface Property {
  _id: string
  propertyType: string
  state: string
  createdAt: string
  status: string
  image?: string
  description?: string
  propertyId:string
  registrationNumber:string
  acquisitionDate:string
  address:string
  propertyImages:string[]
  location?: {
    address: string
    latitude?: number
    longitude?: number
  }
  documents?: string[]
}

export default function PropertyView() {
  //const { id = "" } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  function getPropertyIdFromUrl() {
    const path = window.location.pathname; // "/property/67e452fed9831a0573a9a94a"
    const parts = path.split('/'); // ["", "property", "67e452fed9831a0573a9a94a"]
    return parts[2]; // "67e452fed9831a0573a9a94a"
  }
  const id = getPropertyIdFromUrl();
  useEffect(() => {
   
   //alert(id)
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
       //alert(JSON.stringify(response.data.data))

        setProperty(response.data.data.property)
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
            onClick={() => navigate("/database")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
            <p className="text-sm text-gray-500">ID: {property?.propertyId ?? property?._id}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Image */}
        <Card>
          <CardHeader>
            <CardTitle>Property Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {property?.propertyImages.length>0 ? (
                <img
                  src={property?.propertyImages[0]}
                  alt={property.propertyType}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              {property.propertyType === "house" ? (
                <Building2 className="h-5 w-5 text-gray-500" />
              ) : property.propertyType === "vehicle" ? (
                <Car className="h-5 w-5 text-gray-500" />
              ) : (
                <Landmark className="h-5 w-5 text-gray-500" />
              )}
              <span className="font-medium">Type:</span>
              <span>{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="font-medium">State:</span>
              <span>{property.state.charAt(0).toUpperCase() + property.state.slice(1)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Address:</span>
              <span>{property.address.charAt(0).toUpperCase() + property.address.slice(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SquareMenu className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Registration Number:</span>
              <span>{property.registrationNumber.charAt(0).toUpperCase() + property.registrationNumber.slice(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Registered:</span>
              <span>
                {new Date(property.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Acquisition Date:</span>
              <span>
                {new Date(property.acquisitionDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  property.status === "Active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : property.status === "Under Review"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {property.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        {property.location && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Address</h3>
                  <p className="text-gray-600">{property.location.address}</p>
                </div>
                {(property.location.latitude || property.location.longitude) && (
                  <div>
                    <h3 className="font-medium mb-2">Coordinates</h3>
                    <p className="text-gray-600">
                      {property.location.latitude && `Latitude: ${property.location.latitude}`}
                      {property.location.longitude && `, Longitude: ${property.location.longitude}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {property.description && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        {property.documents && property.documents.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Attached property documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.documents.map((_doc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Document {index + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 