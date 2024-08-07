import { Decimal } from '@prisma/client/runtime/library'

export default interface IGetEquipmentByBranchResponseDTO {
  id: number
  description: string
  code: string
  costCenter: number
  branchId: number
  clientId: number
  mileage: number | Decimal
  familyId: number | Decimal
  family: {
    id: number
    name: string | null
  }
  hourMeter: number | Decimal
  hasPeriod: boolean
  hasMileage: boolean
  hasHourMeter: boolean
  hasAction: boolean
}
