import { BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import InteractiveMap from "./interactivemap";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"


import {  Bar } from "react-chartjs-2"

interface TopRegion {
  state: string;
  total: number;
}
interface MostType{
type:string;
total:string
}

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

export default function Tracking() {
  const navigate = useNavigate()
  const [topRegion, setTopRegion] = useState<TopRegion | null>(null)
  const [mostType,setMostType]= useState<MostType |null>(null)
  const [total,setTotal]= useState("")
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null)
  const [locations,setLocations] =useState([])

  const [loading, setLoading] = useState(true)



  const fetchProperties = async (range="all-time") => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem("authToken")
      if (!token) {
        navigate("/")
        return
      }
      const response = await axios.post(
        `https://bdicisp.vercel.app/api/v1/properties/collection/all?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.error("por: "+JSON.stringify(response.data.data.properties))
      setLocations(response.data.data.properties)
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
  }, [])

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
  const fetchPropertyStats = async (range="all-time") => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        navigate("/")
        return
      }
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await axios.post(
        `https://bdicisp.onrender.com/api/v1/properties/collection/stats?range=${range}`,
        { headers }
      )

      if (response.data) {
        //alert(response.data.data.stats.byType?.land?.count)
       console.error("result "+JSON.stringify(response.data.data))
       setTopRegion(response.data.data.topRegion)
       setMostType(response.data.data.mostCommonType)
       setTotal(response.data.data.totalValue)
       setStats(response.data.data)
        //response.data.data.stats.byType.house.count

       //alert(JSON.stringify(response.data.data.stats.byType.house.count))
        // setStats(response.data)
      }
    } catch (err) {
      console.error(err)
      // Error handling...
    }
  }
  useEffect(() => {
    fetchPropertyStats()
  }, [])
  const handleSelectChange=(value:any)=>{
    console.log(value)
    setTopRegion(null)
    setMostType(null)
    setTotal("")
    
    fetchPropertyStats(value)
    fetchProperties(value)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Visual Tracking</h2>

        <Select onValueChange={(value) => handleSelectChange(value)}  defaultValue="all-time">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="past-quarter">Past Quarter</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
            <SelectItem value="last-month">Past Month</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
          {/* <TabsTrigger value="timeline">Timeline</TabsTrigger> */}
        </TabsList>

        {/* Map View */}
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Property locations across Nigeria</CardDescription>
            </CardHeader>
            
            <CardContent>
            <div className=" mb-5 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Top Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {topRegion && topRegion.state ? topRegion.state.charAt(0).toUpperCase() + topRegion.state.slice(1) : 'Loading...'}
                    </div>
                    <p className="text-sm text-gray-500">{topRegion?.total || 0} properties</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Most Common Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      
                    {mostType && mostType.type ? mostType.type.charAt(0).toUpperCase() + mostType.type.slice(1) : 'Loading...'}
                    </div>
                    <p className="text-sm text-gray-500">{mostType?.total} properties</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{total && total.toLocaleString() ? "₦"+total.toLocaleString(): 'Loading...'}</div>
                    <p className="text-sm text-gray-500">Estimated</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-100 h-[500px] rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
               

                <CardDescription>
            {loading 
              ? "Loading map..." 
              : error 
                ? `An Error Occured while loading maps : ${error}`
                :  <InteractiveMap loc={locations}/>
            }
          </CardDescription>

                      
                  {/* <p className="text-gray-500">Interactive map would be displayed here</p>
                  <p className="text-sm text-gray-400 mt-2">Showing all 87 property locations</p> */}
                </div>
              </div>

          
            </CardContent>
            
          </Card>
        </TabsContent>


        {/* Charts View */}
        <TabsContent value="charts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Institution</CardTitle>
                <CardDescription>Breakdown of institutions categories</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 h-[300px] flex items-center justify-center border-t">
                  <div className="text-center p-6">
                    

            
              <Bar style={{height:300}} data={stats?.institutionDistribution || {
                  labels: [],
                  datasets: [{
                    label: "Properties by Institutions",
                    data: [],
                    backgroundColor: []
                  }]
                }} options={chartOptions} />
            
                  </div>
                </div>
                {/* <div className="p-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">Vehicles</div>
                    <div className="text-gray-500">57%</div>
                  </div>
                  <div>
                    <div className="font-medium">Land</div>
                    <div className="text-gray-500">39%</div>
                  </div>
                  <div>
                    <div className="font-medium">Houses</div>
                    <div className="text-gray-500">4%</div>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution by State</CardTitle>
                <CardDescription>Geographic breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 h-[300px] flex items-center justify-center border-t">
                  <div className="text-center p-6">
                 
                    
                    <Bar style={{height:300}} data={stats?.stateDistribution || {
                  labels: [],
                  datasets: [{
                    label: "Properties by State",
                    data: [],
                    backgroundColor: []
                  }]
                }} />
                  </div>
                </div>
                {/* <div className="p-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">FCT</div>
                    <div className="text-gray-500">37%</div>
                  </div>
                  <div>
                    <div className="font-medium">Lagos</div>
                    <div className="text-gray-500">22%</div>
                  </div>
                  <div>
                    <div className="font-medium">Others</div>
                    <div className="text-gray-500">41%</div>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Registration Trend</CardTitle>
                <CardDescription>Property registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 h-[300px] flex items-center justify-center border-t">
                  <div className="text-center p-6">
                    <BarChart className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                    <p className="text-gray-500">Bar chart would be displayed here</p>
                    <p className="text-sm text-gray-400 mt-2">Showing monthly registration data</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">Q1 2023</div>
                    <div className="text-gray-500">23 properties</div>
                  </div>
                  <div>
                    <div className="font-medium">Q2 2023</div>
                    <div className="text-gray-500">18 properties</div>
                  </div>
                  <div>
                    <div className="font-medium">Q3 2023</div>
                    <div className="text-gray-500">26 properties</div>
                  </div>
                  <div>
                    <div className="font-medium">Q4 2023</div>
                    <div className="text-gray-500">20 properties</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline View */}
        {/* <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Timeline</CardTitle>
              <CardDescription>History of property registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-blue-200 pl-6 ml-6 space-y-6">
                {[
                  { month: "October 2023", count: 7, highlight: "Vehicle fleet expansion" },
                  { month: "September 2023", count: 12, highlight: "Land acquisition in Lagos" },
                  { month: "August 2023", count: 8, highlight: "Office building registration" },
                  { month: "July 2023", count: 10, highlight: "Vehicle fleet maintenance" },
                  { month: "June 2023", count: 5, highlight: "Land documentation update" },
                ].map((period, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[34px] top-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-blue-100" />
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-blue-800">{period.month}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          {period.count} properties
                        </span>
                      </div>
                      <p className="text-gray-600">{period.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

