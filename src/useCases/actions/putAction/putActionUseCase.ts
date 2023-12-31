import CustomError from '@/config/CustomError'
import { env } from '@/env'
import IActionGroupRepository from '@/repositories/IActionGroupRepository'
import IActionRepository from '@/repositories/IActionRepository'
import { Client } from 'basic-ftp'
import IUseCase from '../../../models/IUseCase'
import IPutActionRequestDTO from './IPutActionRequestDTO'

export default class PutActionUseCase implements IUseCase {
  constructor(
    private actionRepository: IActionRepository,
    private actionGroupRepository: IActionGroupRepository,
  ) {}

  async execute(data: IPutActionRequestDTO) {
    if (!data.user.id_cliente) {
      throw CustomError.unauthorized('Não autorizado')
    }

    try {
      const foundAction = await this.actionRepository.findById(data.id)
      if (!foundAction) {
        throw CustomError.badRequest('Ação não encontrada')
      }

      const groupId = foundAction.id_grupo
      if (!groupId) {
        console.log(foundAction)
        throw CustomError.badRequest('Grupo não encontrado')
      }
      if (data.endDate) {
        await this.actionGroupRepository.update(groupId, {
          data_concluida: new Date(data.endDate),
        })
        await this.actionRepository.update(data.id, {
          data_fim: new Date(data.endDate),
        })
      }
      if (data.title) {
        await this.actionGroupRepository.update(groupId, {
          descricao: data.title,
        })
        await this.actionRepository.update(data.id, {
          descricao: data.title,
        })
      }
      if (data.description) {
        await this.actionGroupRepository.update(groupId, {
          descricao_acao: data.description,
        })
        await this.actionRepository.update(data.id, {
          descricao_acao: data.description,
        })
      }
      if (data.responsible) {
        await this.actionGroupRepository.update(groupId, {
          responsavel: data.responsible,
        })
        await this.actionRepository.update(data.id, {
          responsavel: data.responsible,
        })
      }
      if (data.dueDate) {
        await this.actionGroupRepository.update(groupId, {
          data_fim: data.dueDate,
        })
        await this.actionRepository.update(data.id, {
          data_fechamento: data.dueDate,
        })
      }

      const updated = await this.actionGroupRepository.findById(groupId)
      const updatedAction = await this.actionRepository.findById(data.id)
      if (!updated) {
        throw CustomError.badRequest('Não foi possivel editar essa ação')
      }

      const client = new Client()

      await client
        .access({
          host: env.FTP_HOST,
          user: env.FTP_USER,
          password: env.FTP_PASS,
        })
        .catch((error) => {
          console.log('Nao Acessou FTP' + error)
        })

      const remotePath = `/www/sistemas/_lib/img/checkListAction/groupAction_${updated.id}`
      const img: {
        name: string
        url: string
        path: string
      }[] = []
      await client.ensureDir(remotePath)
      await client.cd(remotePath).then(async () => {
        const fileList = await client.list()

        const fileInfoPromises = fileList.map(async (fileItem) => {
          return {
            name: fileItem.name,
            url: `https://www.smartnewsystem.com.br/sistemas/_lib/img/checkListAction/groupAction_${updated.id}/${fileItem.name}`,
            path: '',
          }
        })

        const fileInfo = await Promise.all(fileInfoPromises)
        img.push(...fileInfo)
      })

      client.close()
      return {
        ...updatedAction,
        img,
      }
    } catch (error) {
      console.log(error)
      throw CustomError.internalServerError(
        'Erro ao atualizar dados ' + JSON.stringify(error),
      )
    }
  }
}
