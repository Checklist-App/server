import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import IActionRepository from '../IActionRepository'

export default class ActionRepository implements IActionRepository {
  private table = prisma.smartnewsystem_producao_checklist_acao

  async listByGroup(groupIds: number[], date: Date) {
    return await this.table.findMany({
      select: {
        id: true,
        id_grupo: true,
        id_checklist: true,
        id_registro_producao: true,
        id_item: true,
        descricao: true,
        descricao_acao: true,
        responsavel: true,
        data_fechamento: true,
        data_fim: true,
        data_inicio: true,
        log_date: true,
      },
      where: {
        id_grupo: {
          in: groupIds,
        },
        AND: {
          data_inicio: {
            gte: date,
          },
        },
      },
    })
  }

  async findById(id: number) {
    const found = await this.table.findUnique({
      select: {
        id: true,
        id_grupo: true,
        id_registro_producao: true,
        id_checklist: true,
        id_item: true,
        descricao: true,
        descricao_acao: true,
        responsavel: true,
        data_fechamento: true,
        data_fim: true,
        data_inicio: true,
        log_date: true,
      },
      where: {
        id,
      },
    })

    return found
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedCreateInput,
  ) {
    return await this.table.create({
      data,
    })
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_acaoUpdateInput,
  ) {
    return await this.table.update({
      data,
      where: {
        id,
      },
    })
  }
}
