import { smartnewsystem_producao_checklist_status_cor } from '@prisma/client'

export interface IInfo {
  id: number
  id_cliente: number | null
  id_controle: number | null
  descricao: string | null
  acao: boolean | null
  cor: smartnewsystem_producao_checklist_status_cor | null
  icone: string | null
}

export interface IFindByClient {
  id: number
  descricao: string | null
  icone: string | null
  cor: smartnewsystem_producao_checklist_status_cor | null
}
