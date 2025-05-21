import { ArrowRight, Building2, FileText, MapPin, Shield, Truck,  Lock, Users2, ClipboardCheck, Database, Activity, Clock, TrendingUp, Target, Zap, LogIn, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

// Animation Variants (Optional but recommended for cleaner code)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const buttonHoverTap = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const cardHover = {
  hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" },
  transition: { type: "spring", stiffness: 300 }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren", // Animate parent before children
      staggerChildren: 0.2  // Stagger children animations
    }
  }
};

export default function Landing() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="min-h-screen bg-gray-50 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Sticky Header */}
      <motion.header
        className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/landing")}>
            <img src="https://ik.imagekit.io/bdic/benue-government-properties-web/business/logo/bdiclog.png?updatedAt=1747397802426" alt="Logo" className="h-7 w-7" />
            <span className="font-semibold text-lg text-gray-800">BSIPAM Portal</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={buttonHoverTap.hover}
              whileTap={buttonHoverTap.tap}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              style={{ borderColor: '#1CA260', color: '#1CA260' }}
              onClick={() => navigate("/admin/securelogin/login/")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </motion.button>
            <motion.button
              whileHover={buttonHoverTap.hover}
              whileTap={buttonHoverTap.tap}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
              style={{ backgroundColor: '#1CA260' }}
              onClick={() => navigate("/admin/securelogin/login/")}
            >
               <UserPlus className="mr-2 h-4 w-4" />
              Register Property
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main>
        {/* Hero Section - Adjusted pt for header space */}
        <section className="relative text-white overflow-hidden pt-16" style={{ background: 'linear-gradient(to right, #1CA260, #167f49)' }}>
          <div className="container mx-auto px-6 py-24 relative z-10">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between"
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <motion.div className="md:w-1/2 mb-12 md:mb-0" variants={fadeIn}>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Benue State Integrated Properties and Assets Management Portal
                </h1>
                <p className="text-xl mb-8 text-green-100">
                  Streamlining government asset management with our comprehensive digital solution.
                  Track, manage, and optimize your property portfolio efficiently.
                </p>
                <motion.div className="flex gap-4" variants={fadeIn}>
                  <motion.button
                    whileHover={buttonHoverTap.hover}
                    whileTap={buttonHoverTap.tap}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-white text-emerald-700 hover:bg-green-50"
                    onClick={() => navigate("/admin/securelogin/login/")}
                  >
                    Access Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div className="md:w-1/2 pl-8" variants={fadeIn}>
                <img
                  src="https://ik.imagekit.io/bdic/benue-government-properties-web/business/logo/home_dash.png?updatedAt=1747395166126"
                  alt="Property Management Dashboard Preview"
                  className="rounded-lg shadow-2xl w-full h-auto object-contain"
                />
              </motion.div>
            </motion.div>
          </div>
           {/* Optional: Subtle background animation */}
           <motion.div
              className="absolute inset-0 z-0"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)' }}
            />
        </section>

        {/* Core Capabilities */}
        <motion.section
          className="py-20 bg-gray-50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="container mx-auto px-6">
            <motion.h2 className="text-3xl font-bold text-center mb-12" variants={fadeIn}>Core Capabilities</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} whileHover={cardHover.hover} transition={cardHover.transition}>
                <Card className="border-none shadow-lg h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Asset Tracking</h3>
                    <p className="text-gray-600">
                      Comprehensive tracking of all government properties with real-time updates and status monitoring.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover={cardHover.hover} transition={cardHover.transition}>
                <Card className="border-none shadow-lg h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Location Management</h3>
                    <p className="text-gray-600">
                      Efficient management of property locations with detailed mapping and geographical data.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} whileHover={cardHover.hover} transition={cardHover.transition}>
                <Card className="border-none shadow-lg h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <FileText className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Document Management</h3>
                    <p className="text-gray-600">
                      Secure storage and management of all property-related documents and certificates.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div 
            className="container asscont mx-auto px-6" 
            style={{ 
              backgroundImage: 'linear-gradient(#1ca2600d 1px, transparent 1px), linear-gradient(90deg, #1ca2600d 1px, transparent 1px)',
              backgroundSize: '20px 20px' // Optional: Adjust grid size
            }}
          >
            <motion.h2 className="text-3xl font-bold text-center mb-12" variants={fadeIn}>Comprehensive Asset Management</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div className="space-y-6" variants={fadeIn}>
                <motion.div className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300" variants={fadeIn}>
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Vehicle Fleet Management</h3>
                    <p className="text-gray-600">
                      Track and manage government vehicles with detailed maintenance records and usage statistics.
                    </p>
                  </div>
                </motion.div>
                <motion.div className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300" variants={fadeIn}>
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Building Management</h3>
                    <p className="text-gray-600">
                      Comprehensive management of government buildings and facilities with maintenance scheduling.
                    </p>
                  </div>
                </motion.div>
                <motion.div className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300" variants={fadeIn}>
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Security & Compliance</h3>
                    <p className="text-gray-600">
                      Ensure compliance with government regulations and maintain security standards.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div className="relative mt-8 md:mt-0" variants={fadeIn}>
                <img
                  src="https://ik.imagekit.io/bdic/benue-government-properties-web/business/logo/feat.png?updatedAt=1747395165089"
                  alt="Features diagram"
                  className="rounded-lg shadow-xl w-full h-auto object-contain max-w-md mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Asset Dashboard Section (Refined) */}
        <motion.section
          className="py-12 bg-emerald-50"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d1fae5\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            {/* Static Headers instead of Tabs */} 
            <motion.div className="mb-8 flex justify-center space-x-8 border-b border-gray-200 pb-3" variants={fadeIn}>
              <span className="text-lg font-medium text-emerald-700" style={{ color: '#1CA260' }}>Vehicles</span>
              <span className="text-lg font-medium text-gray-500">Lands</span>
              <span className="text-lg font-medium text-gray-500">Facilities</span>
            </motion.div>

            {/* Content */} 
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Department Asset Utilization */} 
              <motion.div variants={fadeIn}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Department Asset Utilization</h2>
                <motion.div whileHover={cardHover.hover} transition={cardHover.transition}>
                  <Card className="bg-white p-6 rounded-lg shadow-md">
                    <div className="space-y-4">
                      {[
                        { dept: "Transportation", value: 85, color: "bg-emerald-500" },
                        { dept: "Health", value: 75, color: "bg-blue-500" },
                        { dept: "Education", value: 70, color: "bg-orange-500" },
                        { dept: "Defense", value: 90, color: "bg-emerald-500" },
                        { dept: "Agriculture", value: 65, color: "bg-orange-500" },
                
                      ].map((item, index) => (
                        <motion.div
                          key={item.dept}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{item.dept}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                            <motion.div
                              className={`${item.color} h-4 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + index * 0.1 }}
                            />
                            <span className="absolute right-2 top-0 bottom-0 flex items-center text-xs font-medium text-white mix-blend-difference px-1">{item.value}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Asset Status Overview */} 
              <motion.div variants={fadeIn}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Asset Status Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Map over status items for animation */} 
                  {[
                    { title: "Active Assets", value: "1,245", change: null, color: null },
                    { title: "Maintenance", value: "87", change: "-3% from last quarter", color: "orange" },
                    { title: "Decommissioned", value: "42", change: "+8% from last quarter", color: "red" },
                    { title: "New Acquisitions", value: "156", change: null, color: null }
                  ].map((status, index) => (
                    <motion.div key={index} variants={fadeIn} whileHover={cardHover.hover} transition={cardHover.transition}>
                      <Card className="p-6 bg-white rounded-lg shadow-md h-full"> {/* Added h-full */} 
                        <h3 className="text-4xl font-bold mb-2 text-gray-900">{status.value}</h3>
                        <p className="text-gray-600">{status.title}</p>
                        {status.change && (
                          <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${
                            status.color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {status.change}
                          </span>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Security Protocols */}
        <motion.section
          className="py-12 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" variants={fadeIn}>
              <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
                Data Protection
              </div>
              <h2 className="text-3xl font-bold mb-4">Advanced Security Protocols</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Protecting critical government asset data with industry-leading security measures
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Map over protocols for stagger animation */} 
              {[
                { icon: Lock, title: "Government-Grade Encryption", text: "Military-grade encryption protocols to protect sensitive government asset data" },
                { icon: Users2, title: "Multi-Factor Authentication", text: "Secure access with multiple verification layers for authorized personnel only" },
                { icon: Shield, title: "Role-Based Access Control", text: "Granular permissions based on department, role, and security clearance" },
                { icon: ClipboardCheck, title: "Audit Trail & Compliance", text: "Comprehensive logging of all system activities for accountability" },
                { icon: Database, title: "Secure Data Storage", text: "Redundant, encrypted storage with regular backups and disaster recovery protocols" },
                { icon: Activity, title: "Activity Monitoring", text: "Real-time monitoring of system usage with automated alerts for suspicious activities" }
              ].map((proto, index) => (
                <motion.div key={index} variants={fadeIn} whileHover={cardHover.hover} transition={cardHover.transition}>
                  <Card className="p-6 h-full"> 
                    <proto.icon className="h-10 w-10 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{proto.title}</h3>
                    <p className="text-gray-600">{proto.text}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* System Performance Section */}
        <motion.section
          className="py-12 bg-gray-50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" variants={fadeIn}>
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4"
                   style={{ backgroundColor: 'rgba(28, 162, 96, 0.1)', color: '#1CA260' }}>
                Performance Metrics
              </div>
              <h2 className="text-3xl font-bold mb-4">System Performance</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Measurable improvements in government asset management efficiency
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Map over performance metrics for stagger animation */}
              {[
                { icon: Clock, value: "42%", text: "Reduction in reporting time" },
                { icon: TrendingUp, value: "35%", text: "Increase in staff productivity" },
                { icon: Target, value: "28%", text: "Improvement in resource allocation" },
                { icon: Zap, value: "53%", text: "Faster asset deployment" }
              ].map((metric, index) => (
                <motion.div key={index} variants={fadeIn} whileHover={cardHover.hover} transition={cardHover.transition}>
                  <Card className="p-6 text-center bg-white rounded-lg shadow h-full">
                    <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50" style={{ backgroundColor: 'rgba(28, 162, 96, 0.1)' }}>
                      <metric.icon className="h-8 w-8 text-emerald-600" style={{ color: '#1CA260' }} />
                    </div>
                    <h3 className="text-4xl font-bold mb-2" style={{ color: '#1CA260' }}>{metric.value}</h3>
                    <p className="text-gray-600">{metric.text}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 text-white"
          style={{ backgroundColor: '#1CA260' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 className="text-3xl font-bold mb-4" variants={fadeIn}>Ready to Get Started?</motion.h2>
            <motion.p className="text-xl mb-8 text-green-100/90" variants={fadeIn}>
              Join the modern era of government asset management
            </motion.p>
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={buttonHoverTap.hover}
              whileTap={buttonHoverTap.tap}
              variants={fadeIn} // Apply fade-in to the button itself
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-white text-emerald-700 hover:bg-green-50"
            >
              Access Portal
            </motion.button>
          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="text-white py-12" style={{ backgroundColor: '#1CA260' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Shield className="h-8 w-8 text-green-300 mb-4" />
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-green-200">
                Secure government property management system for efficient asset tracking and administration.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Dashboard</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Registration</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Database</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Tracking</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-green-200">Email: support@gov.ng</li>
                <li className="text-green-200">Phone: (234) 123-4567</li>
                <li className="text-green-200">Address: Benue State, Nigeria</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors duration-300">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center">
            <p className="text-green-200">
              © {new Date().getFullYear()} Benue State Government Property Management Authority. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  )
} 