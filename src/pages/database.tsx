"use client"

import { useState, useEffect } from "react"
import { Download, Filter, MapPin, Search, SortAsc } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface Property {
  _id: string
  propertyType: string
  state: string
  createdAt: string
  status: string
  image?: string
  propertyImages?:string[]
  propertyId:string
}

export default function Database() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedType, setSelectedType] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem("authToken")
      if (!token) {
        navigate("/")
        return
      }
      //https://bdicisp.vercel.app/api/v1/properties/collection/all?page=1&limit=10&type=all&sort=newest&search=
      const response = await axios.post(
       // `https://bdicisp.vercel.app/api/v1/properties/collection/all?page=1&limit=10&type=all&sort=newest&search=`,
        `https://bdicisp.vercel.app/api/v1/properties/collection/all?page=${currentPage}&limit=10&propertyType=${selectedType =="all" ?"": selectedType}&sort=${sortBy}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.error(JSON.stringify(response.data))
      setProperties(response.data.data.properties)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          navigate("/")
        } else {
          setError(err.response?.data?.message || "Failed to fetch properties")
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [currentPage, selectedType, sortBy, searchTerm])

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(
        "https://bdicisp.vercel.app/api/v1/property/export",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      )

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "properties.xlsx")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate("/login")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Property Database</h2>
        <Button 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary/10"
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by ID, location or type..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{selectedType.charAt
                    (0).toLocaleUpperCase() + selectedType.slice(1) || "Property Type"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent  >
                  <SelectItem  value="all">All Types</SelectItem>
                  <SelectItem value="house">Houses</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="vehicle">Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <span>Sort By</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="id">ID Number</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Records</CardTitle>
          <CardDescription>
            {loading 
              ? "Loading properties..." 
              : error 
                ? `Error: ${error}`
                : `Showing ${properties.length} registered government properties`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50 text-left">
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        ID
                      </th>
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        Image
                      </th>
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        Type
                      </th>
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        Location
                      </th>
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        Date Registered
                      </th>
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        Status
                      </th>
                      <th className="p-3 border-b border-primary/20 text-primary-foreground bg-primary/10 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ).map((property) => (
                      <tr key={property._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{property.propertyId ?? property._id }</td>
                        <td className="p-3">
                          <div className="w-30 h-20 bg-gray-200 rounded flex items-center justify-center">
                            {property.propertyImages ? (
                              <img 
                                src={property?.propertyImages?.[0]}
                                alt={property?.propertyType} 
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <MapPin className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">{property.propertyType.charAt(0).toUpperCase()+property.propertyType.slice(1)}</td>
                        <td className="p-3">{property.state.charAt(0).toUpperCase()+property.state.slice(1)}</td>
                        <td className="p-3">
                          {new Date(property.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-3">
                          <Badge
                            className={
                              property.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : property.status === "Under Review"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {property.status[0].toLocaleUpperCase() + property.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-primary"
                              onClick={() => navigate(`/property/${property._id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-primary"
                              onClick={() => navigate(`/edit/property/${property._id}`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, properties.length)} of {properties.length} properties
                </p>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "outline" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

