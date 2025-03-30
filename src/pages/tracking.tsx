import { BarChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Tracking() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Visual Tracking</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
            <SelectItem value="quarter">Past Quarter</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Map View */}
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Property locations across Nigeria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 h-[500px] rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Interactive map would be displayed here</p>
                  <p className="text-sm text-gray-400 mt-2">Showing all 87 property locations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Top Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">FCT, Abuja</div>
                    <p className="text-sm text-gray-500">32 properties</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Most Common Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Vehicles</div>
                    <p className="text-sm text-gray-500">50 properties</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₦2.4B</div>
                    <p className="text-sm text-gray-500">Estimated</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts View */}
        <TabsContent value="charts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Type</CardTitle>
                <CardDescription>Breakdown of property categories</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 h-[300px] flex items-center justify-center border-t">
                  <div className="text-center p-6">
                    <PieChart className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pie chart would be displayed here</p>
                    <p className="text-sm text-gray-400 mt-2">Showing distribution by property type</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2 text-center text-sm">
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
                </div>
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
                    <PieChart className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pie chart would be displayed here</p>
                    <p className="text-sm text-gray-400 mt-2">Showing distribution by state</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2 text-center text-sm">
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
                </div>
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
        <TabsContent value="timeline" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

