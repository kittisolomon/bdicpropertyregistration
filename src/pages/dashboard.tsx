import { BarChart3, FileText, Home, MapPin, Plus, School, Truck, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {  Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { hasPermissions,canRegisterProperty, canGenerateReports, canViewStats, canViewProperties } from "@/lib/permissions"
import { Role } from "@/types"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)


interface StatsData {
  stateDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
    }[];
  };
  totalValue:string
  institutionDistribution:{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
    }[];
  }

  propertyDistribution: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}
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
  const [instCount,setInstCount] =useState("")
  const [totalProperties,  setTotalProperties] =useState("");
  const [landCount,setLandCount] =useState("")
  const [vehicleCount,setVehicleCount]=useState("")
  const [properties,setProperties] = useState<Property[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] =useState<String |null>(null)
  //const [stats, setStats] = useState<DashboardStats | null>(null)

  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  //const [timeRange, setTimeRange] = useState("6m")
  const [propertyType, setPropertyType] = useState("all")
  //const [registrationTrend, setRegistrationTrend] = useState<RegistrationTrend[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState<"pdf" | "excel">("pdf")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Role[]>([])
  const fetchPropertyStats = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        navigate("/")
        return
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      await axios.get(
        "https://bdicisp.onrender.com/api/v1/properties/collection/stats/",
        { headers }
      ).then((response)=>{
        if (response.data) {
          setLandCount(response.data.data.stats.landCount || 0)
          setVehicleCount(response.data?.data?.stats?.vehicleCount || 0)
          //alert(JSON.stringify(response.data.data.stats.stats.overall.totalProperties))
          setTotalProperties(response.data?.data?.stats?.allCount ||0 )
          setHouseCount(response.data?.data?.stats?.houseCount ||0)
          setInstCount(response.data?.data?.stats?.institutionCount || 0)
        }
      }).catch(err=>{
     console.error("Cannot fetch state: "+ err)
      })
     
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
        `https://bdicisp.vercel.app/api/v1/properties/collection/all?page=1&limit=10&sort=newest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
  const fetchUserRole = async () => {
    setPropertyType("all")
    try {
      const users = localStorage.getItem("userData")
      if (!users) {
        console.error("No user data found")
        return
      }
      const userData = JSON.parse(users)
      if (!userData.role) {
        console.error("No role found in user data")
        return
      }
      setUserRole(userData.role)
      
      await axios.get("https://bdicisp.onrender.com/api/v1/roles", {
        headers: {
          "x-access-token": ` ${localStorage.getItem("authToken")}`,
        }
      }).then(res => {
        if (Array.isArray(res.data)) {
          setPermissions(res.data)
        } else {
          console.error("Roles data is not an array:", res.data)
        }
      })
    } catch (error) {
      console.error("Failed to fetch user role:", error)
    }
  }

  // const checkAuthExpired = async () => {
  //   const token = localStorage.getItem("authToken")
  //   if(!token) return alert("you don login?")
  //   const response = await axios.post("https://bdicisp.onrender.com/api/v1/auth/check-auth-expired",{
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   alert(response.data)
  // }
  
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if(!token) return navigate("/admin/securelogin/login/")
    Promise.all([
      fetchPropertyStats(),
      fetchProperties(),
      fetchUserRole()
    ])
   
  }, [])

  // Function to fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
     // const token = localStorage.getItem("token")
      axios.post("https://bdicisp.onrender.com/api/v1/properties/collection/stats?range=all-time").then((res)=>{
      console.log(res.data.data)

       setStats(res.data.data)
      }).catch((err)=>{
        console.log(err)
      })
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [ propertyType])

  useEffect(() => {
    // const fetchRegistrationTrend = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await axios.get(
    //       "https://bdicisp.vercel.app/api/v1/property/trend",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     //setRegistrationTrend(registrationTrend)
    //    // setRegistrationTrend(response.data);
    //   } catch (err) {
    //     //setRegistrationTrend(registrationTrend)
    //     //setError("Failed to fetch registration trend data");
    //     console.error("Error fetching registration trend:", err);
    //   }
    // };

    //fetchRegistrationTrend();
  }, []);


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Property Registration Trend",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const generateReport = async (docType: "pdf" | "excel") => {
    try {
      setIsGeneratingReport(true)
      const token = localStorage.getItem("authToken")
      const response = await axios.get(
        `https://bdicisp.onrender.com/api/v1/reports/properties?format=${docType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for downloading files
        }
      )

      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: docType === "pdf" ? "application/pdf" : "application/vnd.ms-excel" 
      })
       
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)
       
      // Create a temporary link element
      const link = document.createElement("a")
      link.href = url
      link.download = `property-report-${new Date().toISOString().split("T")[0]}.${docType === "excel" ? "xls" : "pdf"}`
       
      // Append the link to the document
      document.body.appendChild(link)
       
      // Trigger the download
      link.click()
       
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating report:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsGeneratingReport(false)
      setIsReportDialogOpen(false)
    }
  }
  // Check if user has permission to view dashboard
  if (!userRole || !hasPermissions(userRole, "View Stats", permissions)) {
    return (
      <div className="flex items-center justify-center h-screen">
      
        <div className="text-center">
          <p className="text-gray-600">Loading....</p>
        </div>
       
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>

      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex gap-2">
          {userRole && canRegisterProperty(userRole, "Property Registration", permissions) && (
            <Button onClick={()=>navigate("/registration")} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Register New Property
            </Button>
          )}
          {userRole && canGenerateReports(permissions, userRole) && (
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => setIsReportDialogOpen(true)}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {userRole && canViewStats(permissions, userRole) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <CardTitle className="text-lg font-medium">Institutions</CardTitle>
              <CardDescription>University,Polytechnics,Secondary..</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-3xl font-bold text-primary">{instCount}</div>
              <div className="ml-4 flex items-center">
                <School className="h-8 w-8 text-primary" />
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
      )}

      {/* Map and Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <CardTitle>Property Distribution</CardTitle>
            <CardDescription>Distribution by states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
            <Pie data={demoData.stateDistribution} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div> */}

      

      

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Value Estimate</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{stats?.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8%</span> from last month
                </p>
              </CardContent>
            </Card>
           
      
          </div>

          {/* Charts */}
          {userRole && canViewStats(permissions, userRole) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card>
                <CardHeader>
                  <CardTitle>State Distribution</CardTitle>
                  <CardDescription>Properties by state</CardDescription>
                </CardHeader>
                <CardContent>
                  
                  <Bar data={stats?.stateDistribution || {
                    labels: [],
                    datasets: [{
                      label: "Properties by State",
                      data: [],
                      backgroundColor: []
                    }]
                  }} options={chartOptions} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Property Distribution</CardTitle>
                  <CardDescription>Distribution by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  <Pie data={stats?.propertyDistribution || {
                    labels: [],
                    datasets: [{
                      data: [],
                      backgroundColor: []
                    }]
                  }} options={chartOptions} />
                </CardContent>
              </Card>
             
              {/* <Card>
                <CardHeader>
                  <CardTitle>Institutions Distribution</CardTitle>
                  <CardDescription>Distributions by institution type</CardDescription>
                </CardHeader>
                <CardContent>
                <Bar data={stats?.institutionDistribution || {
                    labels: [],
                    datasets: [{
                      label: "Properties by Institutions",
                      data: [],
                      backgroundColor: []
                    }]
                  }} options={chartOptions} />
                </CardContent>
              </Card> */}
            </div>
          )}


          {/* Recent Activity */}
          {userRole && canViewProperties(permissions, userRole) && (
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
          )}
        </>
      )}

      {/* Report Type Selection Dialog */}
      {userRole && canGenerateReports(permissions, userRole) && (
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Report Type</DialogTitle>
              <DialogDescription>
                Choose the format for your property report
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={selectedDocType === "pdf" ? "default" : "outline"}
                  onClick={() => setSelectedDocType("pdf")}
                  className="flex flex-col items-center gap-2 h-24"
                >
                  <FileText className="h-8 w-8" />
                  <span>PDF Report</span>
                </Button>
                <Button
                  variant={selectedDocType === "excel" ? "default" : "outline"}
                  onClick={() => setSelectedDocType("excel")}
                  className="flex flex-col items-center gap-2 h-24"
                >
                  <BarChart3 className="h-8 w-8" />
                  <span>Excel Report</span>
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => generateReport(selectedDocType)}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

