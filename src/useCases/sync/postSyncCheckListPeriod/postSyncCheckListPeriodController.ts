import { HttpStatusCode } from '@/config/CustomError'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import IController from '../../../models/IController'
import IUseCase from '../../../models/IUseCase'
import IPostSyncCheckListPeriodRequestDTO from './IPostSyncCheckListPeriodRequestDTO'
// import IPostSyncCheckListRequestDTO from './IPostSyncCheckListRequestDTO'

export default class PostSyncCheckListPeriodController implements IController {
  constructor(private useCase: IUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(req: FastifyRequest, res: FastifyReply) {
    const bodySchema = z.object({
      type: z.string(),
      checkListPeriod: z.object({
        _id: z.coerce.string({ description: 'Erro no formato de _id' }),
        id: z.coerce.number({ description: 'Erro no formato de id' }),
        branchId: z.coerce.number({
          description: 'Erro no formato de branchId',
        }),
        productionRegisterId: z.coerce.number({
          description: 'Erro no formato de productionRegisterId',
        }),
        checkListItemId: z.coerce.number({
          description: 'Erro no formato de checkListItemId',
        }),
        statusItem: z.coerce.number({
          description: 'Erro no formato de statusItem',
        }),
        statusNC: z.coerce
          .number({ description: 'Erro no formato de statusNC' })
          .nullable(),
        observation: z.coerce.string().nullable(),
        logDate: z.coerce.string().transform((value) => new Date(value)),
      }),
    })

    const request: IPostSyncCheckListPeriodRequestDTO = {
      user: req.user,
      ...bodySchema.parse(req.body),
    }

    const response = await this.useCase.execute(request)

    res.status(HttpStatusCode.OK).send(response)
  }
}
