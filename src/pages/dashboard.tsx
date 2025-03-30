import { BarChart3, FileText, Home, MapPin, Plus, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  type Property = {
    name: string;
    _id: string;
    propertyType:string,
    propertyId:string,
    createdAt: string; // Use `Date` if `createdAt` is stored as a Date object
  };


  const navigate = useNavigate()
  const [houseCount,setHouseCount] =useState("")
  const [totalProperties,  setTotalProperties] =useState("");
  const [landCount,setLandCount] =useState("")
  const [vehicleCount,setVehicleCount]=useState("")
  const [properties,setProperties] = useState<Property[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] =useState<String |null>(null)

  const fetchPropertyStats = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        navigate("/")
        return
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await axios.get(
        "https://bdicisp.onrender.com/api/v1/properties/collection/stats/",
        { headers }
      )

      if (response.data) {
        //alert(response.data.data.stats.byType?.land?.count)
        setLandCount(response.data.data.stats.byType?.land?.count || 0)
        setVehicleCount(response.data.data.stats.byType?.vehicle?.count || 0)
        //alert(JSON.stringify(response.data.data.stats.stats.overall.totalProperties))
        setTotalProperties(response.data.data.stats.stats.overall.totalProperties)
        setHouseCount(response.data.data.stats.byType?.house?.count)
      

        //response.data.data.stats.byType.house.count

       // alert(JSON.stringify(response.data.data.stats.byType.house.count))
        // setStats(response.data)
      }
    } catch (err) {
      // Error handling...
    }
  }
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
        `https://bdicisp.vercel.app/api/v1/properties/collection/all?page=1&limit=10&sort=newest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.error(JSON.stringify(response.data))
      setProperties(response.data.data.properties)
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
    fetchPropertyStats()
    fetchProperties()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex gap-2">
          <Button onClick={()=>navigate("/registration")} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Register New Property
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Properties</CardTitle>
            <CardDescription>All registered assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalProperties}</div>
            <p className="text-sm text-gray-500 mt-1">+3 since last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Houses</CardTitle>
            <CardDescription>Buildings and structures</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold text-primary">{houseCount}</div>
            <div className="ml-4 flex items-center">
              <Home className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Land</CardTitle>
            <CardDescription>Plots and territories</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold text-primary">{landCount}</div>
            <div className="ml-4 flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Vehicles</CardTitle>
            <CardDescription>Cars and transportation</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold text-primary">{vehicleCount}</div>
            <div className="ml-4 flex items-center">
              <Truck className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

       
      </div>

      {/* Map and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Locations</CardTitle>
            <CardDescription>Geographic distribution of assets</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-100 h-[400px] flex items-center justify-center border-t">
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p className="text-gray-500">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">Showing 87 property locations across Nigeria</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Trend</CardTitle>
            <CardDescription>New properties over time</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-100 h-[400px] flex items-center justify-center border-t">
              <div className="text-center p-6">
                <BarChart3 className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p className="text-gray-500">Chart visualization would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">Showing monthly registration data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest property registrations and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          {/* [
              { id: "GOV/ABJ/2023/087", type: "Vehicle", action: "Registered", date: "Today, 10:23 AM" },
              { id: "GOV/ABJ/2023/086", type: "Land", action: "Updated", date: "Yesterday, 3:45 PM" },
              { id: "GOV/ABJ/2023/085", type: "Vehicle", action: "Registered", date: "Yesterday, 11:30 AM" },
              { id: "GOV/ABJ/2023/084", type: "Land", action: "Updated", date: "Oct 12, 2023, 2:15 PM" },
            ] */}
            {loading &&  <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div> }
            {!properties && error}
            {properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,5).map((item,index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-800">{item?.propertyId ?? item?._id}</p>
                  <p className="text-sm text-gray-500">
                    {item?.propertyType.charAt(0).toLocaleUpperCase() +item?.propertyType.slice(1)} - Registered
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

