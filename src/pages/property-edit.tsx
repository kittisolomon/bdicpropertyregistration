"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { IKContext, IKUpload } from 'imagekitio-react'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup,SelectLabel,  SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import axios from "axios"
import { educationalInstitutionTypes, vehicleTypes } from "@/lib/constants"

interface Property {
  _id: string
  propertyType: string
  propertyId: string
  propertyName: string
  description: string
  acquisitionDate: string
  estimatedValue: number
  buildingFeatures: string[]
  landType: string
  landSize: number
  landCondition: string
  landUse: string
  state: string
  lga: string
  address: string
  longitude: string
  latitude: string
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
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

type BaseData = {
  propertyType: string
  propertyName: string
  propertyId: string
  description: string
  acquisitionDate: string
  estimatedValue: number
  status: string
  state: string
  lga: string
  address: string
  longitude: string
  latitude: string
  coordinates: {
    latitude: string
    longitude: string
  }
  registeredBy?: string
  propertyImages?: string[]
  propertyDeed:string[]
  // House specific fields
  buildingType?: string
  floorCount?: number
  totalArea?: number
  yearBuilt?: number
  currentBuildingUse?: string
  buildingCondition?: string
  buildingFeatures?: string[]
  // Land specific fields
  landType?: string
  landSize?: number
  landSizeUnit?: string
  landCondition?: string
  landUse?: string
  plotNumber?: string
  blockNumber?: string
  layoutName?: string
  surveyPlanNumber?: string
  beaconNumbers?: string
  perimeter?: string
  shape?: string
  topography?: string
  zoningClassification?: string
  titleType?: string
  titleReferenceNumber?: string
  easements?: string
  roadAccess?: string
  utilityAccess?: string[]
  proposedUse?: string
  currentUse?: string
  // Vehicle specific fields
  vehicleType?: string
  makeModel?: string
  year?: number
  registrationNumber?: string
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
  // Petroleum specific fields
  facilityType?: string
  facilityCapacity?: string
  facilityStatus?: string
  totalTanks?: string
  totalPumps?: string
  totalDispensers?: string
  totalStorage?: string
  fuelTypes?: string[]
  safetyCertification?: string
  lastInspectionDate?: string
  nextInspectionDate?: string
  facilityCondition?: string
  facilityFeatures?: string
  tankCapacities?: { type: string; capacity: string; unit: string }[]
  pumpTypes?: { type: string; count: string }[]
  safetyEquipment?: { name: string; quantity: string; lastInspection: string }[]
  // Other property specific fields
  otherPropertySubtype?: string
  totalRooms?: string
  totalBeds?: string
  operatingHours?: string
  maintenanceSchedule?: string
  equipmentList?: { name: string; quantity: string; condition: string }[]
  infrastructureDetails?: { type: string; specifications: string; status: string }[]
}

interface FormData {
  propertyType: string
  propertyName: string
  propertyId: string
  estimatedValue: number
  acquisitionDate: string
  status: string
  state: string
  lga: string
  longitude: string
  latitude: string  
  address: string
  coordinates: {
    latitude: string
    longitude: string
  }
  description: string
  registeredBy?: string
  // House specific fields
  buildingType?: string
  floorCount?: number
  totalArea?: number
  yearBuilt?: number
  currentBuildingUse?: string
  buildingCondition?: string
  buildingFeatures?: string[]
  propertyImages?: string[]
  propertyDeed?:string[]
  // Land specific fields
  landType?: string
  landSize?: number
  landSizeUnit?: string
  landCondition?: string
  landUse?: string
  plotNumber?: string
  blockNumber?: string
  layoutName?: string
  surveyPlanNumber?: string
  beaconNumbers?: string
  perimeter?: string
  shape?: string
  topography?: string
  zoningClassification?: string
  titleType?: string
  titleReferenceNumber?: string
  easements?: string
  roadAccess?: string
  utilityAccess?: string[]
  proposedUse?: string
  currentUse?: string
  // Vehicle specific fields
  vehicleType?: string
  makeModel?: string
  year?: number
  registrationNumber?: string
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
  // Petroleum specific fields
  facilityType?: string
  facilityCapacity?: string
  facilityStatus?: string
  totalTanks?: string
  totalPumps?: string
  totalDispensers?: string
  totalStorage?: string
  fuelTypes?: string[]
  safetyCertification?: string
  lastInspectionDate?: string
  nextInspectionDate?: string
  facilityCondition?: string
  facilityFeatures?: string
  tankCapacities?: { type: string; capacity: string; unit: string }[]
  pumpTypes?: { type: string; count: string }[]
  safetyEquipment?: { name: string; quantity: string; lastInspection: string }[]
  // Other property specific fields
  otherPropertySubtype?: string
  totalRooms?: string
  totalBeds?: string
  operatingHours?: string
  maintenanceSchedule?: string
  equipmentList?: { name: string; quantity: string; condition: string }[]
  infrastructureDetails?: { type: string; specifications: string; status: string }[]
}

export default function PropertyEdit() {
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    propertyName: "",
    propertyId: "",
    estimatedValue: 0,
    acquisitionDate: "",
    status: "",
    state: "",
    lga: "",
    address: "",
    longitude: "",
    latitude: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    description: "",
    registeredBy: "",
    // Initialize all optional fields as undefined
    buildingType: undefined,
    floorCount: undefined,
    totalArea: undefined,
    yearBuilt: undefined,
    propertyImages: [],
    propertyDeed:[],
    currentBuildingUse: undefined,
    buildingCondition: undefined,
    buildingFeatures: undefined,
    landType: undefined,
    landSize: undefined,
    landSizeUnit: undefined,
    landCondition: undefined,
    landUse: undefined,
    plotNumber: undefined,
    blockNumber: undefined,
    layoutName: undefined,
    surveyPlanNumber: undefined,
    beaconNumbers: undefined,
    perimeter: undefined,
    shape: undefined,
    topography: undefined,
    zoningClassification: undefined,
    titleType: undefined,
    titleReferenceNumber: undefined,
    easements: undefined,
    roadAccess: undefined,
    utilityAccess: undefined,
    proposedUse: undefined,
    currentUse: undefined,
    vehicleType: undefined,
    makeModel: undefined,
    year: undefined,
    registrationNumber: undefined,
    vin: undefined,
    engineNumber: undefined,
    vehicleCondition: undefined,
    color: undefined,
    seatingCapacity: undefined,
    purchasePrice: undefined,
    fuelType: undefined,
    transmission: undefined,
    mileage: undefined,
    lastServiceDate: undefined,
    nextServiceDue: undefined,
    insuranceProvider: undefined,
    insurancePolicyNumber: undefined,
    insuranceExpiryDate: undefined,
    assignedDriver: undefined,
    assignedDepartment: undefined,
    parkingLocation: undefined,
    institutionType: undefined,
    institutionLevel: undefined,
    institutionName: undefined,
    yearEstablished: undefined,
    totalStudents: undefined,
    totalStaff: undefined,
    totalClassrooms: undefined,
    totalLaboratories: undefined,
    totalOffices: undefined,
    totalToilets: undefined,
    totalHostels: undefined,
    totalLibraries: undefined,
    totalAuditoriums: undefined,
    totalSportsFacilities: undefined,
    institutionCondition: undefined,
    institutionStatus: undefined,
    institutionFeatures: undefined,
    facilityType: undefined,
    facilityCapacity: undefined,
    facilityStatus: undefined,
    totalTanks: undefined,
    totalPumps: undefined,
    totalDispensers: undefined,
    totalStorage: undefined,
    fuelTypes: undefined,
    safetyCertification: undefined,
    lastInspectionDate: undefined,
    nextInspectionDate: undefined,
    facilityCondition: undefined,
    facilityFeatures: undefined,
    tankCapacities: undefined,
    pumpTypes: undefined,
    safetyEquipment: undefined,
    otherPropertySubtype: undefined,
    totalRooms: undefined,
    totalBeds: undefined,
    operatingHours: undefined,
    maintenanceSchedule: undefined,
    equipmentList: undefined,
    infrastructureDetails: undefined
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  function getPropertyIdFromUrl() {
    const path = window.location.pathname; // "/property/67e452fed9831a0573a9a94a"
    const parts = path.split('/'); // ["", "property", "67e452fed9831a0573a9a94a"]
    return parts[3]; // "67e452fed9831a0573a9a94a"
  }
  const id = getPropertyIdFromUrl();
  //alert(id)
  useEffect(() => {
    setIsDeleting(false)
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
          propertyName: propertyData.propertyName,
          propertyId: propertyData.propertyId,
          estimatedValue: propertyData.estimatedValue,
          acquisitionDate: propertyData.acquisitionDate,
          status: propertyData.status,
          state: propertyData.state,
          lga: propertyData.lga,
          address: propertyData.address,
          topography: propertyData.topography || "",
          longitude: propertyData.longitude || "",
          latitude: propertyData.latitude || "",
          coordinates: {
            latitude: propertyData.coordinates.coordinates[1],
            longitude: propertyData.coordinates.coordinates[0],
          },
          facilityType: propertyData.facilityType || "",
          roadAccess: propertyData.roadAccess || "",
          currentUse: propertyData.currentUse || "",
          proposedUse: propertyData.proposedUse || "",
          description: propertyData.description || "",
          landType: propertyData.landType || "",
          landSize: propertyData.landSize || 0,
          shape: propertyData.shape || "",
          layoutName: propertyData.layoutName || "",
          landCondition: propertyData.landCondition || "",
          landUse: propertyData.landUse || "",
          facilityCapacity : propertyData.facilityCapacity || "",
          facilityStatus : propertyData.facilityStatus || "",
          safetyCertification : propertyData.safetyCertification || "",

          lastInspectionDate : propertyData.lastInspectionDate || "",
          nextInspectionDate : propertyData.nextInspectionDate || "",
          facilityCondition : propertyData.facilityCondition || "",
          totalTanks : propertyData.totalTanks || "",
          totalPumps : propertyData.totalPumps || "",
          totalDispensers : propertyData.totalDispensers || "",
          totalStorage : propertyData.totalStorage || "",
          facilityFeatures : propertyData.facilityFeatures || "",
          fuelTypes: propertyData.fuelTypes || "",
          titleType: propertyData.titleType || "",
          titleReferenceNumber: propertyData.titleReferenceNumber || "",
          surveyPlanNumber: propertyData.surveyPlanNumber || "",
          beaconNumbers: propertyData.beaconNumbers || "",
          landSizeUnit: propertyData.landSizeUnit || "hectares",
          vehicleType: propertyData.vehicleType || "",
          makeModel: propertyData.makeModel || "",
          year: propertyData.year || 0,
          vin: propertyData.vin || "",
          engineNumber: propertyData.engineNumber || "",
          vehicleCondition: propertyData.vehicleCondition || "",
          color: propertyData.color || "",
          seatingCapacity: propertyData.seatingCapacity || "",
          purchasePrice: propertyData.purchasePrice || "",
          transmission: propertyData.transmission || "",
          mileage: propertyData.mileage || "",
          lastServiceDate: propertyData.lastServiceDate || "",
          nextServiceDue: propertyData.nextServiceDue || "",
          insuranceProvider: propertyData.insuranceProvider || "",
          insurancePolicyNumber: propertyData.insurancePolicyNumber || "",
          insuranceExpiryDate: propertyData.insuranceExpiryDate || "",
          assignedDriver: propertyData.assignedDriver || "",
          assignedDepartment: propertyData.assignedDepartment || "",
          parkingLocation: propertyData.parkingLocation || "",
          buildingType: propertyData.buildingType || "",
          floorCount: propertyData.floorCount || 0,
          totalArea: propertyData.totalArea || 0,
          yearBuilt: propertyData.yearBuilt || 0,
          currentBuildingUse: propertyData.currentBuildingUse || "",
          buildingCondition: propertyData.buildingCondition || "",
          buildingFeatures: propertyData.buildingFeatures || [],
          // Institution specific fields
          institutionType: propertyData.institutionType || "",
          institutionLevel: propertyData.institutionLevel || "",
          institutionName: propertyData.institutionName || "",
          yearEstablished: propertyData.yearEstablished || "",
          totalStudents: propertyData.totalStudents || "",
          totalStaff: propertyData.totalStaff || "",
          totalClassrooms: propertyData.totalClassrooms || "",
          totalLaboratories: propertyData.totalLaboratories || "",
          totalOffices: propertyData.totalOffices || "",
          totalToilets: propertyData.totalToilets || "",
          totalHostels: propertyData.totalHostels || "",
          totalLibraries: propertyData.totalLibraries || "",
          totalAuditoriums: propertyData.totalAuditoriums || "",
          totalSportsFacilities: propertyData.totalSportsFacilities || "",
          institutionCondition: propertyData.institutionCondition || "",
          institutionStatus: propertyData.institutionStatus || "",
          institutionFeatures: propertyData.institutionFeatures || "",
          registeredBy: propertyData.registeredBy || "",
          propertyImages: propertyData.propertyImages || [],
          propertyDeed:propertyData.propertyDeed || [],
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
  const handleDeleteImage = (index: number) => {
    if (!property?.propertyImages) return;
    const updatedImages = [...property.propertyImages];
    updatedImages.splice(index, 1);
    setProperty({ ...property, propertyImages: updatedImages });
    setFormData((prev) => ({ ...prev, propertyImages: updatedImages }));
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      // Create base object with common fields
      const baseData: BaseData = {
        propertyType: formData.propertyType,
        propertyName: formData.propertyName,
        propertyId: formData.propertyId,
        description: formData.description,
        acquisitionDate: formData.acquisitionDate,
        estimatedValue: formData.estimatedValue,
        status: formData.status,
        state: formData.state,
        lga: formData.lga,
        address: formData.address,
        longitude: formData.longitude,
        latitude: formData.latitude,
        coordinates: {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude,
        },
        registeredBy: formData.registeredBy,
        propertyImages: formData.propertyImages || [],
        propertyDeed:formData.propertyDeed || [],
      }

      // Add type-specific fields based on property type
      let submitData = { ...baseData }

      switch (formData.propertyType) {
        case "house":
          submitData = {
            ...submitData,
            buildingType: formData.buildingType,
            floorCount: formData.floorCount,
            totalArea: formData.totalArea,
            yearBuilt: formData.yearBuilt,
            propertyImages: formData.propertyImages,
            propertyDeed:formData.propertyDeed || [],
            currentBuildingUse: formData.currentBuildingUse,
            buildingCondition: formData.buildingCondition,
            buildingFeatures: formData.buildingFeatures,
            landType: formData.landType,
            landSize: formData.landSize,
            landSizeUnit: formData.landSizeUnit,
            landCondition: formData.landCondition,
            landUse: formData.landUse,
            plotNumber: formData.plotNumber,
            blockNumber: formData.blockNumber,
            layoutName: formData.layoutName,
            surveyPlanNumber: formData.surveyPlanNumber,
            beaconNumbers: formData.beaconNumbers,
            perimeter: formData.perimeter,
            shape: formData.shape,
            topography: formData.topography,
            zoningClassification: formData.zoningClassification,
            titleType: formData.titleType,
            titleReferenceNumber: formData.titleReferenceNumber,
            easements: formData.easements,
            roadAccess: formData.roadAccess,
            utilityAccess: formData.utilityAccess,
            proposedUse: formData.proposedUse,
            currentUse: formData.currentUse
          }
          break

        case "land":
          submitData = {
            ...submitData,
            landType: formData.landType,
            landSize: formData.landSize,
            landSizeUnit: formData.landSizeUnit,
            landCondition: formData.landCondition,
            landUse: formData.landUse,
            plotNumber: formData.plotNumber,
            blockNumber: formData.blockNumber,
            layoutName: formData.layoutName,
            surveyPlanNumber: formData.surveyPlanNumber,
            beaconNumbers: formData.beaconNumbers,
            perimeter: formData.perimeter,
            shape: formData.shape,
            propertyImages:formData.propertyImages,
            propertyDeed:formData.propertyDeed || [],
            topography: formData.topography,
            zoningClassification: formData.zoningClassification,
            titleType: formData.titleType,
            titleReferenceNumber: formData.titleReferenceNumber,
            easements: formData.easements,
            roadAccess: formData.roadAccess,
            utilityAccess: formData.utilityAccess,
            proposedUse: formData.proposedUse,
            currentUse: formData.currentUse
          }
          break

        case "vehicle":
          submitData = {
            ...submitData,
            vehicleType: formData.vehicleType,
            makeModel: formData.makeModel,
            year: formData.year,
            registrationNumber: formData.registrationNumber,
            vin: formData.vin,
            engineNumber: formData.engineNumber,
            vehicleCondition: formData.vehicleCondition,
            color: formData.color,
            seatingCapacity: formData.seatingCapacity,
            purchasePrice: formData.purchasePrice,
            fuelType: formData.fuelType,
            transmission: formData.transmission,
            mileage: formData.mileage,
            propertyImages: formData.propertyImages,
            propertyDeed:formData.propertyDeed || [],
            lastServiceDate: formData.lastServiceDate,
            nextServiceDue: formData.nextServiceDue,
            insuranceProvider: formData.insuranceProvider,
            insurancePolicyNumber: formData.insurancePolicyNumber,
            insuranceExpiryDate: formData.insuranceExpiryDate,
            assignedDepartment: formData.assignedDepartment,
            assignedDriver: formData.assignedDriver,
            parkingLocation: formData.parkingLocation
          }
          break

        case "institutions":
          submitData = {
            ...submitData,
            institutionType: formData.institutionType,
            institutionLevel: formData.institutionLevel,
            institutionName: formData.institutionName,
            yearEstablished: formData.yearEstablished,
            totalStudents: formData.totalStudents,
            totalStaff: formData.totalStaff,
            totalClassrooms: formData.totalClassrooms,
            totalLaboratories: formData.totalLaboratories,
            totalOffices: formData.totalOffices,
            totalToilets: formData.totalToilets,
            totalHostels: formData.totalHostels,
            totalLibraries: formData.totalLibraries,
            propertyImages: formData.propertyImages,
            propertyDeed:formData.propertyDeed || [],
            totalAuditoriums: formData.totalAuditoriums,
            totalSportsFacilities: formData.totalSportsFacilities,
            institutionCondition: formData.institutionCondition,
            institutionStatus: formData.institutionStatus,
            institutionFeatures: formData.institutionFeatures
          }
          break

        case "petroleum":
          submitData = {
            ...submitData,
            facilityType: formData.facilityType,
            facilityCapacity: formData.facilityCapacity,
            facilityStatus: formData.facilityStatus,
            totalTanks: formData.totalTanks,
            totalPumps: formData.totalPumps,
            totalDispensers: formData.totalDispensers,
            totalStorage: formData.totalStorage,
            fuelTypes: formData.fuelTypes,
            safetyCertification: formData.safetyCertification,
            lastInspectionDate: formData.lastInspectionDate,
            nextInspectionDate: formData.nextInspectionDate,
            facilityCondition: formData.facilityCondition,
            facilityFeatures: formData.facilityFeatures,
            tankCapacities: formData.tankCapacities,
            pumpTypes: formData.pumpTypes,
            propertyImages: formData?.propertyImages,
            propertyDeed:formData.propertyDeed || [],
            safetyEquipment: formData.safetyEquipment
          }
          break

        case "others":
          submitData = {
            ...submitData,
            otherPropertySubtype: formData.otherPropertySubtype,
            totalRooms: formData.totalRooms,
            totalBeds: formData.totalBeds,
            operatingHours: formData.operatingHours,
            maintenanceSchedule: formData.maintenanceSchedule,
            equipmentList: formData.equipmentList,
            infrastructureDetails: formData.infrastructureDetails,
            propertyImages: formData?.propertyImages,
            propertyDeed:formData.propertyDeed || [],
          }
          break
      }

      await axios.put(
        `https://bdicisp.vercel.app/api/v1/properties/collection/${id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      toast.success('Property updated successfully')


      navigate(`/edit/property/${id}`)
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
const urlEndpoint = 'https://ik.imagekit.io/bdic';
const publicKey = 'public_k/7VGHSYTH1q/STxZGOGFWUrsdE='; 
const authenticator =  async () => {
 
    try {
        const response = await axios.post('https://bdicisp.onrender.com/api/v1/auth/imagekit/auth');

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


const [uploading,setUploading] = useState(false)
const [iuploading,setIUploading] = useState(false)
const [duploading,setDUploading] = useState(false)


const onIdeedsError = (err:any) => {
  console.log("Error", err,iuploading);
  setIUploading(false)
  setDUploading(false)
};

const onIdeedsSuccess = (res:any) => {
  setIUploading(false)
  setIsUploading(false)
  setFormData((prev) => {
    const updatedImages = [...(prev.propertyImages || []), res.url];
    console.log("Success...", res.url, updatedImages);
    if (property) {
      setProperty({ ...property, propertyImages: updatedImages });
    }
    return { ...prev, propertyImages: updatedImages };
  });
};

const onIdeedsUploadProgress = (progress:any) => {
  setIUploading(true)
  setIsUploading(true)
  console.log("Progress...", progress);
};



const onDdeedsError = (err:any) => {
  console.log("Error", err);
  setUploading(false)
  setDUploading(false)
};

const onDdeedsSuccess = (res:any) => {
  setDUploading(false)
  setFormData((prev) => {
    const updatedImages = [...(prev.propertyDeed || []), res.url];
    console.log("Success...", res.url, updatedImages);
    if (property) {
      setProperty({ ...property, propertyDeed: updatedImages });
    }
    return { ...prev, propertyDeed: updatedImages };
  });
};

const onDdeedsUploadProgress = (progress:any) => {
  setDUploading(true)
  //setIsUploading(true)
  console.log("Progress...", progress);
};





  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("coordinates.")) {
      const coordinateField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordinateField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files
  //   if (!files || files.length === 0) return

  //   try {
  //     setIsUploading(true)
  //     const formData = new FormData()
  //     Array.from(files).forEach((file) => {
  //       formData.append('images', file)
  //     })

  //     const response = await axios.post(
  //       `https://bdicisp.vercel.app/api/v1/properties/${id}/images`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     )

  //     if (property) {
  //       setProperty({
  //         ...property,
  //         propertyImages: [...(property.propertyImages || []), ...response.data.data.images],
  //       })
  //     }
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       setError(err.response?.data?.message || "Failed to upload images")
  //     } else {
  //       setError("An unexpected error occurred")
  //     }
  //   } finally {
  //     setIsUploading(false)
  //   }
  // }

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
                    <SelectItem value="institutions">Institutions</SelectItem>
                    <SelectItem value="petroleum">Petroleum</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="Enter property name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyId">Property ID</Label>
                <Input
                  id="propertyId"
                  name="propertyId"
                  disabled
                  value={formData.propertyId}
                  onChange={handleChange}
                  placeholder="Enter property ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value (₦)</Label>
                <Input
                  id="estimatedValue"
                  name="estimatedValue"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="Enter estimated value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                <Input
                  id="acquisitionDate"
                  name="acquisitionDate"
                  type="date"
                  value={new Date(formData.acquisitionDate).toISOString().split('T')[0]}
                  onChange={handleChange}
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Land Details - Only show when property type is land */}
          {formData.propertyType === "land" && (
            <Card>
              <CardHeader>
                <CardTitle>Land Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landType">Land Type</Label>
                  <Select
                    value={formData.landType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, landType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select land type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential Plot">Residential Plot</SelectItem>
                      <SelectItem value="Commercial Plot">Commercial Plot</SelectItem>
                      <SelectItem value="Industrial Plot">Industrial Plot</SelectItem>
                      <SelectItem value="Agricultural Land">Agricultural Land / Farmland</SelectItem>
                      <SelectItem value="Forest Reserve">Forest Reserve / Green Zone</SelectItem>
                      <SelectItem value="School Reserved Land">School Reserved Land</SelectItem>
                      <SelectItem value="Health Facility Reserved Land">Health Facility Reserved Land</SelectItem>
                      <SelectItem value="Government Reserved Area">Government Reserved Area (GRA)</SelectItem>
                      <SelectItem value="Recreational Land">Recreational / Park Land</SelectItem>
                      <SelectItem value="Cemetery">Cemetery / Burial Ground</SelectItem>
                      <SelectItem value="Road Reserve">Road / Transport Corridor Reserve</SelectItem>
                      <SelectItem value="Water Resource Land">Water Resource Land (e.g., near dams, rivers)</SelectItem>
                      <SelectItem value="Market Expansion Land">Market Expansion Land</SelectItem>
                      <SelectItem value="Unallocated Government Land">Unallocated Government Land</SelectItem>
                      <SelectItem value="Land with Disputes">Land with Disputes / Encumbrances</SelectItem>
                      <SelectItem value="Leasehold Plot">Leasehold Plot</SelectItem>
                      <SelectItem value="Public Infrastructure Land">Land for Public Infrastructure Projects</SelectItem>
                      <SelectItem value="Buffer Zone">Buffer Zone / Right of Way</SelectItem>
                      <SelectItem value="Tourism Development Plot">Tourism Development Plot</SelectItem>
                      <SelectItem value="Relocation Plot">Relocation / Resettlement Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="landSize">Land Size</Label>
                    <Input
                      id="landSize"
                      name="landSize"
                      type="number"
                      value={formData.landSize}
                      onChange={handleChange}
                      placeholder="Enter land size"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landSizeUnit">Unit</Label>
                    <Select
                      value={formData.landSizeUnit}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, landSizeUnit: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ha">Hectares</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="square meters">Square Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landCondition">Land Condition</Label>
                  <Select
                    value={formData.landCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, landCondition: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select land condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                      <SelectItem value="Under Development">Under Development</SelectItem>
                      <SelectItem value="Abandoned">Abandoned</SelectItem>
                      <SelectItem value="Contaminated">Contaminated</SelectItem>
                      <SelectItem value="Eroded">Eroded</SelectItem>
                      <SelectItem value="Flooded">Flooded</SelectItem>
                      <SelectItem value="Overgrown">Overgrown</SelectItem>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentUse">Current Use</Label>
                  <Select
                    value={formData.currentUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currentUse: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vacant">Vacant</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Recreational">Recreational</SelectItem>
                      <SelectItem value="Institutional">Institutional</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Abandoned">Abandoned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposedUse">Proposed Use</Label>
                  <Select
                    value={formData.proposedUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, proposedUse: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select proposed use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Recreational">Recreational</SelectItem>
                      <SelectItem value="Institutional">Institutional</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Conservation">Conservation</SelectItem>
                      <SelectItem value="No Change">No Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roadAccess">Road Access </Label>
                  <Select
                    value={formData.roadAccess}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, roadAccess: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select road access" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="Tarred Road">Tarred Road</SelectItem>
                  <SelectItem value="Untarred Road">Untarred Road</SelectItem>
                  <SelectItem value="Paved Access Road">Paved Access Road</SelectItem>
                  <SelectItem value="Earth Road">Earth Road</SelectItem>
                  <SelectItem value="No Direct Access">No Direct Access</SelectItem>
                  <SelectItem value="Pedestrian Path Only">Pedestrian Path Only</SelectItem>
                  <SelectItem value="Proposed Road">Proposed Road (On Plan)</SelectItem>
                </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topography">Topography</Label>
                  <Select
                    value={formData.topography}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, topography: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topography" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Slightly Sloped">Slightly Sloped</SelectItem>
                      <SelectItem value="Moderately Sloped">Moderately Sloped</SelectItem>
                      <SelectItem value="Steep">Steep</SelectItem>
                      <SelectItem value="Hilly">Hilly</SelectItem>
                      <SelectItem value="Valley">Valley</SelectItem>
                      <SelectItem value="Plateau">Plateau</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shape">Land Shape</Label>
                  <Select
                    value={formData.shape}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, shape: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select land shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rectangular">Rectangular</SelectItem>
                      <SelectItem value="Square">Square</SelectItem>
                      <SelectItem value="Irregular">Irregular</SelectItem>
                      <SelectItem value="L-Shaped">L-Shaped</SelectItem>
                      <SelectItem value="Triangular">Triangular</SelectItem>
                      <SelectItem value="Trapezoidal">Trapezoidal</SelectItem>
                      <SelectItem value="Circular">Circular</SelectItem>
                      <SelectItem value="Oval">Oval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layoutName">Layout Name/Scheme</Label>
                  <Select
                    value={formData.layoutName}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, layoutName: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout name/scheme" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="New GRA">New GRA</SelectItem>
                  <SelectItem value="Old GRA">Old GRA</SelectItem>
                  <SelectItem value="Federal Low-Cost Housing Scheme">Federal Low-Cost Housing Scheme</SelectItem>
                  <SelectItem value="High-Level Layout">High-Level Layout</SelectItem>
                  <SelectItem value="Low-Level Layout">Low-Level Layout</SelectItem>
                  <SelectItem value="Wurukum Layout">Wurukum Layout</SelectItem>
                  <SelectItem value="Modern Market Layout">Modern Market Layout</SelectItem>
                  <SelectItem value="North Bank Layout">North Bank Layout</SelectItem>
                  <SelectItem value="Nyiman Layout">Nyiman Layout</SelectItem>
                  <SelectItem value="Apir Industrial Layout">Apir Industrial Layout</SelectItem>
                  <SelectItem value="Welfare Quarters Layout">Welfare Quarters Layout</SelectItem>
                  <SelectItem value="Staff Quarters Scheme">Staff Quarters Scheme</SelectItem>
                  <SelectItem value="Education Board Housing Scheme">Education Board Housing Scheme</SelectItem>
                  <SelectItem value="Police Barracks Layout">Police Barracks Layout</SelectItem>
                  <SelectItem value="Army Barracks Layout">Army Barracks Layout</SelectItem>
                  <SelectItem value="Custom Layout">Custom Layout</SelectItem>
                  <SelectItem value="Industrial Layout">Industrial Layout</SelectItem>
                  <SelectItem value="Agric Layout">Agric Layout</SelectItem>
                  <SelectItem value="Judges Quarters Layout">Judges Quarters Layout</SelectItem>
                  <SelectItem value="Mobile Police Quarters Layout">Mobile Police Quarters Layout</SelectItem>
                  <SelectItem value="Government Reserved Area (GRA)">Government Reserved Area (GRA)</SelectItem>
                  <SelectItem value="Makurdi International Market Layout">Makurdi International Market Layout</SelectItem>
                  <SelectItem value="Private Developer Estate">Private Developer Estate</SelectItem>
                  <SelectItem value="Unplanned Area / Informal Settlement">Unplanned Area / Informal Settlement</SelectItem>
                  <SelectItem value="Other">Other (Specify)</SelectItem>
                </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surveyPlanNumber">Survey Plan Number (Optional)</Label>
                  <Input
                    id="surveyPlanNumber"
                    name="surveyPlanNumber"
                    value={formData.surveyPlanNumber}
                    onChange={handleChange}
                    placeholder="Enter survey plan number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beaconNumbers">Beacon Numbers (Optional)</Label>
                  <Input
                    id="beaconNumbers"
                    name="beaconNumbers"
                    value={formData.beaconNumbers}
                    onChange={handleChange}
                    placeholder="Enter beacon numbers (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleType">Title Type</Label>
                  <Select
                    value={formData.titleType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, titleType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title type" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="Certificate of Occupancy">Certificate of Occupancy (C of O)</SelectItem>
                  <SelectItem value="Right of Occupancy">Right of Occupancy (R of O)</SelectItem>
                  <SelectItem value="Deed of Assignment">Deed of Assignment</SelectItem>
                  <SelectItem value="Deed of Conveyance">Deed of Conveyance</SelectItem>
                  <SelectItem value="Freehold">Freehold</SelectItem>
                  <SelectItem value="Customary Right of Occupancy">Customary Right of Occupancy</SelectItem>
                  <SelectItem value="Gazette">Gazette</SelectItem>
                  <SelectItem value="Excision">Excision</SelectItem>
                  <SelectItem value="Allocation Letter">Allocation Letter</SelectItem>
                  <SelectItem value="Government Lease">Government Lease</SelectItem>
                  <SelectItem value="Unknown">Unknown / Unregistered</SelectItem>
                  <SelectItem value="Other">Other (Specify)</SelectItem>
                </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titleReferenceNumber">Title Reference Number</Label>
                  <Input
                    id="titleReferenceNumber"
                    name="titleReferenceNumber"
                    value={formData.titleReferenceNumber}
                    onChange={handleChange}
                    placeholder="Enter title reference number"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Details - Only show when property type is vehicle */}
          {formData.propertyType === "vehicle" && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type </Label>
                  <Select
                  value={formData.vehicleType}
                   onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, vehicleType: value }))
                  }
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(vehicleTypes).map(([category, types]: [string, string[]]) => (
                      <SelectGroup key={category}>
                        <SelectLabel>{category.toUpperCase()}</SelectLabel>
                        {types.map((type: string) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="makeModel">Make & Model</Label>
                  <Input
                    id="makeModel"
                    name="makeModel"
                    value={formData.makeModel}
                    onChange={handleChange}
                    placeholder="Enter make and model"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="Enter year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Enter color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      placeholder="Enter VIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineNumber">Engine Number</Label>
                    <Input
                      id="engineNumber"
                      name="engineNumber"
                      value={formData.engineNumber}
                      onChange={handleChange}
                      placeholder="Enter engine number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleCondition">Condition</Label>
                  <Select
                    value={formData.vehicleCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, vehicleCondition: value }))
                    }
                  >
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, fuelType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                         <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                    <SelectItem value="lpg">LPG</SelectItem>
                  </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, transmission: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="Enter mileage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                    <Input
                      id="seatingCapacity"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleChange}
                      placeholder="Enter seating capacity"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastServiceDate">Last Service Date</Label>
                    <Input
                      id="lastServiceDate"
                      name="lastServiceDate"
                      type="date"
                      value={formData.lastServiceDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextServiceDue">Next Service Due</Label>
                    <Input
                      id="nextServiceDue"
                      name="nextServiceDue"
                      type="date"
                      value={formData.nextServiceDue}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedDriver">Assigned Driver</Label>
                  <Input
                    id="assignedDriver"
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleChange}
                    placeholder="Enter assigned driver"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedDepartment">Assigned Department</Label>
                  <Input
                    id="assignedDepartment"
                    name="assignedDepartment"
                    value={formData.assignedDepartment}
                    onChange={handleChange}
                    placeholder="Enter assigned department"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parkingLocation">Parking Location</Label>
                  <Input
                    id="parkingLocation"
                    name="parkingLocation"
                    value={formData.parkingLocation}
                    onChange={handleChange}
                    placeholder="Enter parking location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    placeholder="Enter insurance provider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      name="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={handleChange}
                      placeholder="Enter policy number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceExpiryDate">Expiry Date</Label>
                    <Input
                      id="insuranceExpiryDate"
                      name="insuranceExpiryDate"
                      type="date"
                      value={formData.insuranceExpiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* House Details - Only show when property type is house */}
          {formData.propertyType === "house" && (
            <Card>
              <CardHeader>
                <CardTitle>House Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingType">Building Type</Label>
                  <Select
                    value={formData.buildingType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, buildingType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel / Motel">Hotel / Motel</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floorCount">Floor Count</Label>
                    <Input
                      id="floorCount"
                      name="floorCount"
                      type="number"
                      value={formData.floorCount}
                      onChange={handleChange}
                      placeholder="Enter floor count"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Total Area (sqm)</Label>
                    <Input
                      id="totalArea"
                      name="totalArea"
                      type="number"
                      value={formData.totalArea}
                      onChange={handleChange}
                      placeholder="Enter total area"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    placeholder="Enter year built"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentBuildingUse">Current Use</Label>
                  <Select
                    value={formData.currentBuildingUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, currentBuildingUse: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leased_commercial">Leased (Commercial)</SelectItem>
                      <SelectItem value="leased_residential">Leased (Residential)</SelectItem>
                      <SelectItem value="government_use">Government Use</SelectItem>
                      <SelectItem value="vacant">Vacant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingCondition">Condition</Label>
                  <Select
                    value={formData.buildingCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, buildingCondition: value }))
                    }
                  >
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
              </CardContent>
            </Card>
          )}

          {/* Institution Details - Only show when property type is institutions */}
          {formData.propertyType === "institutions" && (
            <Card>
              <CardHeader>
                <CardTitle>Institution Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionType">Institution Type</Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                  {Object.entries(educationalInstitutionTypes).map(([category, types]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionLevel">Institution Level</Label>
                  <Select
                    value={formData.institutionLevel}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution level" />
                    </SelectTrigger>
                    <SelectContent>
                   

                      <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="mission">Mission</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="Enter institution name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    name="yearEstablished"
                    type="number"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                    placeholder="Enter year established"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalStudents">Total Students</Label>
                    <Input
                      id="totalStudents"
                      name="totalStudents"
                      type="number"
                      value={formData.totalStudents}
                      onChange={handleChange}
                      placeholder="Enter total students"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalStaff">Total Staff</Label>
                    <Input
                      id="totalStaff"
                      name="totalStaff"
                      type="number"
                      value={formData.totalStaff}
                      onChange={handleChange}
                      placeholder="Enter total staff"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalClassrooms">Total Classrooms</Label>
                    <Input
                      id="totalClassrooms"
                      name="totalClassrooms"
                      type="number"
                      value={formData.totalClassrooms}
                      onChange={handleChange}
                      placeholder="Enter total classrooms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalLaboratories">Total Laboratories</Label>
                    <Input
                      id="totalLaboratories"
                      name="totalLaboratories"
                      type="number"
                      value={formData.totalLaboratories}
                      onChange={handleChange}
                      placeholder="Enter total laboratories"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalOffices">Total Offices</Label>
                    <Input
                      id="totalOffices"
                      name="totalOffices"
                      type="number"
                      value={formData.totalOffices}
                      onChange={handleChange}
                      placeholder="Enter total offices"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalToilets">Total Toilets</Label>
                    <Input
                      id="totalToilets"
                      name="totalToilets"
                      type="number"
                      value={formData.totalToilets}
                      onChange={handleChange}
                      placeholder="Enter total toilets"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalHostels">Total Hostels</Label>
                    <Input
                      id="totalHostels"
                      name="totalHostels"
                      type="number"
                      value={formData.totalHostels}
                      onChange={handleChange}
                      placeholder="Enter total hostels"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalLibraries">Total Libraries</Label>
                    <Input
                      id="totalLibraries"
                      name="totalLibraries"
                      type="number"
                      value={formData.totalLibraries}
                      onChange={handleChange}
                      placeholder="Enter total libraries"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAuditoriums">Total Auditoriums</Label>
                    <Input
                      id="totalAuditoriums"
                      name="totalAuditoriums"
                      type="number"
                      value={formData.totalAuditoriums}
                      onChange={handleChange}
                      placeholder="Enter total auditoriums"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalSportsFacilities">Total Sports Facilities</Label>
                    <Input
                      id="totalSportsFacilities"
                      name="totalSportsFacilities"
                      type="number"
                      value={formData.totalSportsFacilities}
                      onChange={handleChange}
                      placeholder="Enter total sports facilities"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionCondition">Institution Condition</Label>
                  <Select
                    value={formData.institutionCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionCondition: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionStatus">Institution Status</Label>
                  <Select
                    value={formData.institutionStatus}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, institutionStatus: value }))
                    }
                  >

                 
             
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution status" />
                    </SelectTrigger>
                    <SelectContent>
                   

                        <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="temporary_closed">Temporarily Closed</SelectItem>
                  <SelectItem value="under_construction">Under Construction</SelectItem>
                  <SelectItem value="renovation">Under Renovation</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
              
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionFeatures">Special Features</Label>
                  <Textarea
                    id="institutionFeatures"
                    name="institutionFeatures"
                    value={formData.institutionFeatures}
                    onChange={handleChange}
                    placeholder="Enter special features or unique attributes of the institution"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Petroleum Details - Only show when property type is petroleum */}
          {formData.propertyType === "petroleum" && (
            <Card>
              <CardHeader>
                <CardTitle>Petroleum Station Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityType">Facility Type</Label>
                 <Select
                    value={formData.facilityType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, facilityType: value }))
                    }
                  >
                  <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="filling_station">Filling Station</SelectItem>
                  <SelectItem value="depot">Depot</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="CNG Station">CNG Station</SelectItem>
                  <SelectItem value="lpg_plant">LPG Plant</SelectItem>
                  <SelectItem value="Bulk Storage Facility">Bulk Storage Facility</SelectItem>
                  <SelectItem value="lubricant_plant">Lubricant Plant</SelectItem>
                  <SelectItem value="aviation_fuel">Aviation Fuel Facility</SelectItem>
                 </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityCapacity">Facility Capacity</Label>
                  <Input
                    id="facilityCapacity"
                    name="facilityCapacity"
                    value={formData.facilityCapacity}
                    onChange={handleChange}
                    placeholder="Enter facility capacity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityStatus">Facility Status</Label>
                  <Select
                    value={formData.facilityStatus}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, facilityStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="temporarily_closed">Temporarily Closed</SelectItem>
                      <SelectItem value="permanently_closed">Permanently Closed</SelectItem>
                      <SelectItem value="under_construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalTanks">Total Tanks</Label>
                    <Input
                      id="totalTanks"
                      name="totalTanks"
                      type="number"
                      value={formData.totalTanks}
                      onChange={handleChange}
                      placeholder="Enter total tanks"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPumps">Total Pumps</Label>
                    <Input
                      id="totalPumps"
                      name="totalPumps"
                      type="number"
                      value={formData.totalPumps}
                      onChange={handleChange}
                      placeholder="Enter total pumps"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalDispensers">Total Dispensers</Label>
                    <Input
                      id="totalDispensers"
                      name="totalDispensers"
                      type="number"
                      value={formData.totalDispensers}
                      onChange={handleChange}
                      placeholder="Enter total dispensers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalStorage">Total Storage</Label>
                    <Input
                      id="totalStorage"
                      name="totalStorage"
                      value={formData.totalStorage}
                      onChange={handleChange}
                      placeholder="Enter total storage"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelTypes">Fuel Types</Label>
                  <Input
                    id="fuelTypes"
                    name="fuelTypes"
                    value={formData.fuelTypes?.join(", ") || ""}
                    onChange={(e) => {
                      const values = e.target.value.split(",").map(v => v.trim()).filter(v => v);
                      setFormData((prev) => ({ ...prev, fuelTypes: values }));
                    }}
                    placeholder="Enter fuel types (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safetyCertification">Safety Certification</Label>
                  <Input
                    id="safetyCertification"
                    name="safetyCertification"
                    value={formData.safetyCertification}
                    onChange={handleChange}
                    placeholder="Enter safety certification"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
                    <Input
                      id="lastInspectionDate"
                      name="lastInspectionDate"
                      type="date"
                      value={formData.lastInspectionDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextInspectionDate">Next Inspection Date</Label>
                    <Input
                      id="nextInspectionDate"
                      name="nextInspectionDate"
                      type="date"
                      value={formData.nextInspectionDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityCondition">Facility Condition</Label>
                  <Select
                    value={formData.facilityCondition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, facilityCondition: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityFeatures">Facility Features</Label>
                  <Textarea
                    id="facilityFeatures"
                    name="facilityFeatures"
                    value={formData.facilityFeatures}
                    onChange={handleChange}
                    placeholder="Enter facility features"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tank Capacities</Label>
                  <div className="space-y-2">
                    {formData.tankCapacities?.map((tank, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Type"
                          value={tank.type}
                          onChange={(e) => {
                            const newTanks = [...(formData.tankCapacities || [])];
                            newTanks[index] = { ...tank, type: e.target.value };
                            setFormData((prev) => ({ ...prev, tankCapacities: newTanks }));
                          }}
                        />
                        <Input
                          placeholder="Capacity"
                          value={tank.capacity}
                          onChange={(e) => {
                            const newTanks = [...(formData.tankCapacities || [])];
                            newTanks[index] = { ...tank, capacity: e.target.value };
                            setFormData((prev) => ({ ...prev, tankCapacities: newTanks }));
                          }}
                        />
                        <Input
                          placeholder="Unit"
                          value={tank.unit}
                          onChange={(e) => {
                            const newTanks = [...(formData.tankCapacities || [])];
                            newTanks[index] = { ...tank, unit: e.target.value };
                            setFormData((prev) => ({ ...prev, tankCapacities: newTanks }));
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tankCapacities: [...(prev.tankCapacities || []), { type: "", capacity: "", unit: "" }],
                        }));
                      }}
                    >
                      Add Tank
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pump Types</Label>
                  <div className="space-y-2">
                    {formData.pumpTypes?.map((pump, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Type"
                          value={pump.type}
                          onChange={(e) => {
                            const newPumps = [...(formData.pumpTypes || [])];
                            newPumps[index] = { ...pump, type: e.target.value };
                            setFormData((prev) => ({ ...prev, pumpTypes: newPumps }));
                          }}
                        />
                        <Input
                          placeholder="Count"
                          value={pump.count}
                          onChange={(e) => {
                            const newPumps = [...(formData.pumpTypes || [])];
                            newPumps[index] = { ...pump, count: e.target.value };
                            setFormData((prev) => ({ ...prev, pumpTypes: newPumps }));
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          pumpTypes: [...(prev.pumpTypes || []), { type: "", count: "" }],
                        }));
                      }}
                    >
                      Add Pump Type
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Safety Equipment</Label>
                  <div className="space-y-2">
                    {formData.safetyEquipment?.map((equipment, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Name"
                          value={equipment.name}
                          onChange={(e) => {
                            const newEquipment = [...(formData.safetyEquipment || [])];
                            newEquipment[index] = { ...equipment, name: e.target.value };
                            setFormData((prev) => ({ ...prev, safetyEquipment: newEquipment }));
                          }}
                        />
                        <Input
                          placeholder="Quantity"
                          value={equipment.quantity}
                          onChange={(e) => {
                            const newEquipment = [...(formData.safetyEquipment || [])];
                            newEquipment[index] = { ...equipment, quantity: e.target.value };
                            setFormData((prev) => ({ ...prev, safetyEquipment: newEquipment }));
                          }}
                        />
                        <Input
                          type="date"
                          value={equipment.lastInspection}
                          onChange={(e) => {
                            const newEquipment = [...(formData.safetyEquipment || [])];
                            newEquipment[index] = { ...equipment, lastInspection: e.target.value };
                            setFormData((prev) => ({ ...prev, safetyEquipment: newEquipment }));
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          safetyEquipment: [...(prev.safetyEquipment || []), { name: "", quantity: "", lastInspection: "" }],
                        }));
                      }}
                    >
                      Add Safety Equipment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, state: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state.toLowerCase()}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <Input
                  id="lga"
                  name="lga"
                  value={formData.lga}
                  onChange={handleChange}
                  placeholder="Enter LGA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        latitude:e.target.value ,
                      }))
                    }
                    placeholder="Enter latitude"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        longitude: e.target.value ,
                      }))
                    }
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
          {/* <Card className="md:col-span-2">
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
                        <Button  variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
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
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card> */}


           {/* Property Documents */}
           <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Property Documents</CardTitle>
              <CardDescription>Upload and manage property documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '500px' }}>
                  {property?.propertyDeed && property.propertyDeed.length > 0 ? (
                    // <img
                    //   src={selectedImage || property.propertyDeed[0]}
                    //   alt={property.propertyType}
                    //   className="max-w-full max-h-full object-contain cursor-pointer"
                    //   onClick={() => {
                    //     if (property.propertyDeed && property.propertyDeed.length > 0) {
                    //       setSelectedImage(property.propertyDeed[0])
                    //       setIsPreviewOpen(true)
                    //     }
                    //   }}
                    // />

                    <div className="flex flex-col items-center justify-center h-full">
                    <a 
                      href={selectedImage || property.propertyDeed[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-gray-400"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <path d="M12 18v-6"/>
                        <path d="M8 18v-1"/>
                        <path d="M16 18v-3"/>
                      </svg>
                      <span className="text-sm text-gray-500 mt-2">View Document</span>
                    </a>
                  </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {property?.propertyDeed && property.propertyDeed.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.propertyDeed.map((image, index) => (
                      <div
                        key={index}
                        className={`relative rounded-md overflow-hidden cursor-pointer border-2 flex items-center justify-center ${
                          selectedImage === image ? "border-primary" : "border-transparent"
                        }`}
                        style={{ height: '250px' }}
                      >
                        {image.split('/')[5] === 'documents' ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <a 
                              href={image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="48" 
                                height="48" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-gray-400"
                              >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <path d="M12 18v-6"/>
                                <path d="M8 18v-1"/>
                                <path d="M16 18v-3"/>
                              </svg>
                              <span className="text-sm text-gray-500 mt-2">View Document</span>
                            </a>
                          </div>
                        ) : (
                          <img
                            src={image}
                            alt={`Property document ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onClick={() => {
                              setSelectedImage(image)
                              setIsPreviewOpen(true)
                            }}
                          />
                        )}
                        {/* <img
                          src={image}
                          alt={`Property document ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                          onClick={() => {
                            setSelectedImage(image)
                            setIsPreviewOpen(true)
                          }}
                        /> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          
                          type="button"
                          className="absolute top-1 right-1 h-6 w-6 bg-red-500/80 hover:bg-red-500 text-white"
                          onClick={() => handleDeleteImage(index)}
                          disabled={isDeleting}
                        >
                          <X className="h-4 w-4" /> 
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

              <IKContext
                  urlEndpoint={urlEndpoint}
                  publicKey={publicKey}
                  
                  authenticator={authenticator}
                >

  
             {/* Upload Button */}
             <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
              {
                    duploading &&  <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              }
                    <div className="flex flex-col items-center justify-center pt-10 pb-6 ">
                      <Upload className="w-5 h-5 mb-2 mt-5 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> 
                      </p>
                      <p className="text-xs text-gray-500">PDF,PNG,JPEG (MAX. 10MB)</p>
                      <IKUpload
                      id="property-documents"
                      name="property-documents"
                      className="hidden"
                      multiple={false}
                      onUploadProgress={onDdeedsUploadProgress}
                      folder={"/benue-government-properties/documents"}
                      fileName="test-upload.png"
                      onError={onDdeedsError}
                      onSuccess={onDdeedsSuccess}
                       />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 h-8 mb-5 "
                      type="button"
                      disabled={uploading || false}
                      onClick={() =>  document.getElementById("property-documents")?.click()}
                    >
                      Select File
                    </Button>
                   
                    </div>

             
                  </label>

                  
                </div>

      </IKContext>
           
              </div>
            </CardContent>
          </Card>


             {/* Property Images */}
             <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>Upload and manage property images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '500px' }}>
                  {property?.propertyImages && property.propertyImages.length > 0 ? (
                    <img
                      src={selectedImage || property.propertyImages[0]}
                      alt={property.propertyType}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                      onClick={() => {
                        if (property.propertyImages && property.propertyImages.length > 0) {
                          setSelectedImage(property.propertyImages[0])
                          setIsPreviewOpen(true)
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {property?.propertyImages && property.propertyImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.propertyImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative rounded-md overflow-hidden cursor-pointer border-2 flex items-center justify-center ${
                          selectedImage === image ? "border-primary" : "border-transparent"
                        }`}
                        style={{ height: '250px' }}
                      >
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                          onClick={() => {
                            setSelectedImage(image)
                            setIsPreviewOpen(true)
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          
                          type="button"
                          className="absolute top-1 right-1 h-6 w-6 bg-red-500/80 hover:bg-red-500 text-white"
                          onClick={() => handleDeleteImage(index)}
                          disabled={isDeleting}
                        >
                          <X className="h-4 w-4" /> 
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

              <IKContext
                  urlEndpoint={urlEndpoint}
                  publicKey={publicKey}
                  
                  authenticator={authenticator}
                >

  
             {/* Upload Button */}
             <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
              {
                    isUploading &&  <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              }
                    <div className="flex flex-col items-center justify-center pt-10 pb-6 ">
                      <Upload className="w-5 h-5 mb-2 mt-5 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> 
                      </p>
                      <p className="text-xs text-gray-500">JPG, PNG, or GIF (MAX. 10MB)</p>
                      <IKUpload
                      id="property-images"
                      name="property-images"
                      className="hidden"
                      multiple={false}
                      onUploadProgress={onIdeedsUploadProgress}
                      folder={"/benue-government-properties/images"}
                      fileName="test-upload.png"
                      onError={onIdeedsError}
                      onSuccess={onIdeedsSuccess}
                       />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 h-8 mb-5 "
                      type="button"
                      disabled={uploading || false}
                      onClick={() =>  document.getElementById("property-images")?.click()}
                    >
                      Select File
                    </Button>
                   
                    </div>

             
                  </label>

                  
                </div>

      </IKContext>
           
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

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Property Image</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={selectedImage || ""}
              alt="Property preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}