export default interface IGetChecklistResponseDTO {
  id: number
  equipmentId: number | null
  locationId: number | null
  periodId: number | null
  login: string
  initialTime: Date
  finalTime: Date | null
  status: 'open' | 'close'
}
