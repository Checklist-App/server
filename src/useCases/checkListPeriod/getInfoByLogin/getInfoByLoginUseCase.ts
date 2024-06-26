import { env } from '@/env'
import { readdirSync } from 'fs'
import IUseCase from '../../../models/IUseCase'
import ICheckListPeriodRepository from '../../../repositories/ICheckListPeriodRepository'
import IGetInfoByLoginRequestDTO from './IGetInfoByLoginRequestDTO'
import IGetInfoByLoginResponseDTO from './IGetInfoByLoginResponseDTO'

export default class GetInfoByLoginUseCase implements IUseCase {
  constructor(private checkListPeriodRepository: ICheckListPeriodRepository) {}

  async execute(data: IGetInfoByLoginRequestDTO) {
    const allCheckListPeriod = await this.checkListPeriodRepository.infoByLogin(
      data.user.login,
      new Date(new Date().setDate(new Date().getDate() - 1)), // Ontem
    )

    const response: IGetInfoByLoginResponseDTO[] = []
    // const pathCheckList = '../sistemas/_lib/img/checkList'
    const pathCheckList = `${env.FILE_PATH}/checkList`
    const files = readdirSync(pathCheckList)
    console.log('Buscando Imagens...')

    const allNamesIds = files.map((item) => item.split('_')[1] || '')

    // console.log(allNamesIds)

    for await (const item of allCheckListPeriod) {
      // const remotePath = `../sistemas/_lib/img/checkList/task_${item.id}`
      const remotePath = `${env.FILE_PATH}/checkList/task_${item.id}`

      try {
        const findTask = allNamesIds.find((value) => Number(value) === item.id)

        if (findTask) {
          // console.log('Encontrei Pasta : ' + findTask)
          const fileList = readdirSync(remotePath)
          const fileInfo = fileList.map((fileItem) => {
            return {
              name: fileItem,
              url: `${env.URL_IMAGE}/checkList/task_${item.id}/${fileItem}`,
              path: `${env.URL_IMAGE}/checkList/task_${item.id}/${fileItem}`,
            }
          })

          response.push({
            id: item.id,
            branchId: item.id_filial || 0,
            productionRegisterId: item.id_registro_producao || 0,
            checkListItemId: item.id_item_checklist || 0,
            img: fileInfo,
            // img: [],
            statusItem: item.status_item || 0,
            statusNC: item.status_item_nc || 0,
            logDate: item.log_date,
          })
        } else {
          response.push({
            id: item.id,
            branchId: item.id_filial || 0,
            productionRegisterId: item.id_registro_producao || 0,
            checkListItemId: item.id_item_checklist || 0,
            img: [],
            statusItem: item.status_item || 0,
            statusNC: item.status_item_nc || 0,
            logDate: item.log_date,
          })
        }
      } catch (error) {
        console.error(error)

        response.push({
          id: item.id,
          branchId: item.id_filial || 0,
          productionRegisterId: item.id_registro_producao || 0,
          checkListItemId: item.id_item_checklist || 0,
          img: [],
          statusItem: item.status_item || 0,
          statusNC: item.status_item_nc || 0,
          logDate: item.log_date,
        })
      }
    }

    return {
      checkListPeriod: response,
    }
  }
}
