import { FastifyInstance } from 'fastify'
import getEquipmentByBranch from '../../../useCases/equipment/getEquipmentByBranch'
import getHourMeterAndMileage from '../../../useCases/equipment/getHourMeterAndMileage'
import getMileage from '../../../useCases/equipment/getMileage'
import patchRegisterPopulation from '../../../useCases/equipment/patchRegisterPopulation'
import putEquipment from '../../../useCases/equipment/putEquipment'

export default async function equipmentRoutes(equipment: FastifyInstance) {
  equipment.put('/:id', putEquipment.handle)
  equipment.get('/byBranch', getEquipmentByBranch.handle)
  equipment.get('/hourMeterAndMileage/:id', getHourMeterAndMileage.handle)
  equipment.get('/mileage/:id', getMileage.handle)
  equipment.patch('/registerPopulation', patchRegisterPopulation.handle)
}
