import { prisma } from '@/lib/prisma'
import { Prisma, smartnewsystem_producao_checklist_turno } from '@prisma/client'
import { IInfoByLogin } from '../../models/ICheckListPeriod'
import ICheckListPeriodRepository from '../ICheckListPeriodRepository'

export default class CheckListPeriodRepository
  implements ICheckListPeriodRepository
{
  private table = prisma.smartnewsystem_producao_checklist_turno

  async findById(id: number) {
    const found = await this.table.findUnique({
      where: {
        id,
      },
    })
    return found
  }

  async countForStatus(statusId: number): Promise<number> {
    const count = await this.table.count({
      where: {
        status_item: statusId,
      },
    })

    return count
  }

  async countForStatusByBranch(branches: number[]) {
    const count = await this.table.aggregate({
      _count: {
        status_item: true,
      },
      where: {
        checklist: {
          equipment: {
            branch: {
              ID: {
                in: branches,
              },
            },
          },
        },
      },
    })

    return count
  }

  async countForEquipment(equipmentId: number): Promise<number> {
    const count = await this.table.count({
      where: {
        checklist: {
          id_equipamento: equipmentId,
        },
      },
    })

    return count
  }

  async listForProductionRegister(
    productionRegisterId: number,
  ): Promise<smartnewsystem_producao_checklist_turno[]> {
    return await this.table.findMany({
      where: {
        id_registro_producao: productionRegisterId,
      },
    })
  }

  async infoByLogin(login: string, date: Date): Promise<IInfoByLogin[]> {
    const data = await this.table.findMany({
      select: {
        id: true,
        id_filial: true,
        checklist: {
          select: {
            id: true,
          },
        },
        id_item_checklist: true,
        status_item: true,
        status_item_nc: true,
        log_date: true,
      },
      where: {
        checklist: {
          login,
          data_hora_inicio: {
            gte: date,
            // gte: new Date('2023-09-01'),
            // gte: new Date(new Date().setDate(new Date().getDate() - 1)), // Ontem
          },
        },
      },
    })

    return data.map(({ checklist, ...item }) => ({
      ...item,
      id_registro_producao: checklist?.id || null,
    }))
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_turnoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_turno> {
    return await this.table.create({
      data,
    })
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_turnoUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_checklist_turno> {
    return await this.table.update({
      data,
      where: {
        id,
      },
    })
  }
}
