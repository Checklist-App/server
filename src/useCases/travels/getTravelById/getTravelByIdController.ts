import IController from '@/models/IController'
import IUseCase from '@/models/IUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import IGetTravelByIdRequestDTO from './IGetTravelByIdRequestDTO'

export default class GetTravelByIdController implements IController {
  constructor(private useCase: IUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(req: FastifyRequest, res: FastifyReply) {
    const queryParams = z.object({
      id: z.coerce.number().refine((item) => item > 0),
    })

    const { id } = queryParams.parse(req.params)

    const request: IGetTravelByIdRequestDTO = {
      user: req.user,
      id,
    }

    const response = await this.useCase.execute(request)

    res.status(200).send(response)
  }
}
