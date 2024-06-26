import CustomError from '@/config/CustomError'
import ActionGroupRepository from '@/repositories/implementations/ActionGroupRepository'
import ActionRepository from '@/repositories/implementations/ActionRepository'
import IFileService from '@/services/IFileService'
import IUseCase from '../../../models/IUseCase'
import IGetByClientRequestDTO from './IGetByClientRequestDTO'
import IGetByClientResponseDTO from './IGetByClientResponseDTO'
import { env } from '@/env'

export default class GetByClientUseCase implements IUseCase {
  constructor(
    private actionRepository: ActionRepository,
    private actionGroupRepository: ActionGroupRepository,
    private fileService: IFileService,
  ) {}

  async execute(data: IGetByClientRequestDTO) {
    if (!data.user.id_cliente) {
      throw CustomError.unauthorized('Sem permissão')
    }

    const groupsByClient = await this.actionGroupRepository.listByClient(
      data.user.id_cliente,
    )

    const groupIds = groupsByClient.map((group) => group.id)

    const actions = await this.actionRepository.listByGroup(
      groupIds,
      new Date(new Date().setDate(new Date().getDate() - 1)), // Ontem
    )
    const response: IGetByClientResponseDTO[] = []
    for (const action of actions) {
      const remotePath = `${env.FILE_PATH}/checkListAction/groupAction_${action.id_grupo}`
      const fileList = this.fileService.list(remotePath)
      const fileInfo = fileList.map((fileItem) => {
        return {
          name: fileItem,
          url: `${env.URL_IMAGE}/checkListAction/groupAction_${action.id_grupo}/${fileItem}`,
          path: `${env.URL_IMAGE}/checkListAction/groupAction_${action.id_grupo}/${fileItem}`,
        }
      })

      response.push({
        ...action,
        img: fileInfo,
      })
    }

    return response
  }
}
