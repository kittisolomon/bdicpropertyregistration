import { Role } from "@/types"

export const hasPermission = (permissions: Role[], role: string) => {
  if (!role) return false
  const permission = permissions.find(p => p.val === role)
  return permission || false
}

export const dohasPermission = (
  roleName: string,
  permissionName: string,
  allRoles: Role[]
): boolean => {
  const role = allRoles.find((r) => r.val === roleName)
  if (!role) return false
  return role.permissions.some(
    (perm) => perm.name === permissionName && perm.granted
  )
}

export const canViewDashboard = (role: string, permissionName: string, rolesData: Role[]) => {
  return dohasPermission(role, permissionName, rolesData)
}

export const hasPermissions = (role: string, permissionName: string, rolesData: Role[]) => {
    return dohasPermission(role, permissionName, rolesData)
  }

export const canRegisterProperty = (role: string, permissionName: string, rolesData: Role[]) => {
  return dohasPermission(role, permissionName, rolesData)
}

export const canGenerateReports = (permissions: Role[], role: string) => {
  return hasPermission(permissions, role) && (role === "superadmin" || role === "governor" || role === "state_admin" || role === "lga_officer")
}

export const canViewStats = (permissions: Role[], role: string) => {
  return hasPermission(permissions, role) && (role === "superadmin" || role === "governor" || role === "state_admin" || role === "lga_officer")
}

export const canViewProperties = (permissions: Role[], role: string) => {
  return hasPermission(permissions, role) && (role === "superadmin" || role === "governor" || role === "state_admin" || role === "lga_officer")
}

export const canEditProperties = (permissions: Role[], role: string) => {
  return hasPermission(permissions, role) && (role === "superadmin" || role === "state_admin")
}

export const canDeleteProperties = (permissions: Role[], role: string) => {
  return hasPermission(permissions, role) && (role === "superadmin" || role === "state_admin")
} 