import { IAction } from '@/models/IAction'
import { Prisma, smartnewsystem_producao_checklist_acao } from '@prisma/client'

// interface ListByGroupType extends smartnewsystem_producao_checklist_acao {
//   productionRegister: {
//     id_equipamento: number
//   }
// }

export default interface IActionRepository {
  listByGroup(groupIds: number[], date: Date): Promise<IAction['listByGroup'][]>
  findById(id: number): Promise<IAction['findById'] | null>
  create(
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_acao>
  update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_checklist_acao>
}
