import CustomError from '@/config/CustomError'
import IUseCase from '@/models/IUseCase'
import ICheckListItemRepository from '@/repositories/ICheckListItemRepository'
import ICheckListPeriodRepository from '@/repositories/ICheckListPeriodRepository'
import IEquipmentRepository from '@/repositories/IEquipmentRepository'
import IPeriodRepository from '@/repositories/IPeriodRepository'
import IProductionRegisterRepository from '@/repositories/IProductionRegisterRepository'
import ISmartCheckListRepository from '@/repositories/ISmartCheckListRepository'
import CheckListXModelRepository from '@/repositories/implementations/CheckListXModelRepository'
import LocationRepository from '@/repositories/implementations/LocationRepository'
import IPostCheckListRequestDTO from './IPostCheckListRequestDTO'
import IEquipmentRegisterRepository from '@/repositories/IEquipmentRegisterRepository'
import axios from 'axios'

export default class PostCheckListUseCase implements IUseCase {
  constructor(
    private productionRegisterRepository: IProductionRegisterRepository,
    private equipmentRepository: IEquipmentRepository,
    private periodRepository: IPeriodRepository,
    private checkListItemRepository: ICheckListItemRepository,
    private checkListPeriodRepository: ICheckListPeriodRepository,
    private smartCheckListRepository: ISmartCheckListRepository,
    private locationRepository: LocationRepository,
    private checklistXModelRepository: CheckListXModelRepository,
    private equipmentRegisterRepository: IEquipmentRegisterRepository,
  ) {}

  async execute(data: IPostCheckListRequestDTO) {
    // let type = 'equipment'
    // let branchId = 0
    if (!data.user.id_cliente) {
      throw CustomError.notFound('Usuário não encontrado!')
    }

    if (data.equipmentId) {
      const equipment = await this.equipmentRepository.findById(
        data.equipmentId,
      )

      if (!equipment) {
        throw CustomError.notFound('Equipamento não encontrado!')
      }
      // if (equipment.ID_filial) {
      //   branchId = equipment.ID_filial
      // }
    }

    if (data.locationId) {
      const location = await this.locationRepository.findById(data.locationId)

      if (!location) {
        throw CustomError.notFound('Localizacao não encontrado!')
      }

      // branchId = location.id_filial
    }

    if (data.periodId) {
      const period = await this.periodRepository.findById(data.periodId)

      if (!period) {
        throw CustomError.notFound('Período não encontrado!')
      }
    }

    // const allCheckListItem: {
    //   id: number
    // }[] = []

    // for await (const checkListId of data.model) {
    //   const checkListItem = await this.checkListItemRepository.listByCheckList(
    //     checkListId,
    //   )

    //   if (checkListItem.length === 0) {
    //     throw CustomError.notFound('Tarefas não vinculados!')
    //   }

    //   allCheckListItem.push(
    //     ...checkListItem.map((item) => {
    //       return {
    //         id: item.id,
    //       }
    //     }),
    //   )
    // }

    const checklist = await this.smartCheckListRepository.save({
      id_cliente: data.user.id_cliente,
      id_equipamento: data.equipmentId,
      id_localizacao: data.locationId,
      id_turno: data.periodId,
      login: data.user.login,
      data_hora_inicio: data.initialTime,
      odometro: data.odometer ?? null,
      quilometragem: data.mileage ?? null,
      horimetro: data.hourMeter ?? null,
      // turno: period.turno || 'Turno_1',
      status: 1,
    })

    for await (const modelId of data.model) {
      await this.checklistXModelRepository.insert({
        id_checklist: checklist.id,
        id_modelo: modelId,
      })

      if (data.equipmentId) {
        await axios(
          `https://api.smartnewservices.com.br/smart-list/bound/${modelId}/cronJob/${data.equipmentId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      }
    }

    if (data.equipmentId) {
      let registerEquipment =
        await this.equipmentRegisterRepository.findByEquipment(data.equipmentId)

      if (!registerEquipment) {
        registerEquipment = await this.equipmentRegisterRepository.create({
          id_cliente: data.user.id_cliente,
          id_equipamento: data.equipmentId,
          horimetro: data.hourMeter ?? 0,
          quilometragem: data.mileage ?? 0,
        })
      } else {
        await this.equipmentRegisterRepository.update(registerEquipment.id, {
          horimetro: data.hourMeter ?? registerEquipment.horimetro,
          quilometragem: data.mileage ?? registerEquipment.quilometragem,
          update_log_date: new Date(),
        })
      }
    }

    // for await (const checkListItem of allCheckListItem) {
    //   await this.checkListPeriodRepository.create({
    //     id_filial: branchId,
    //     id_checklist: checklist.id,
    //     id_item_checklist: checkListItem.id,
    //   })
    // }
    // for await (const checkListItem of allCheckListItem) {
    //   await this.checkListPeriodRepository.create({
    //     id_filial: branchId,
    //     id_checklist: checklist.id,
    //     id_item_checklist: checkListItem.id,
    //   })
    // }

    return {
      id: checklist.id,
    }
  }
}
