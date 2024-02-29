import IController from '@/models/IController'
import IUseCase from '@/models/IUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import IGetByLoginRequestDTO from './IGetByLoginRequestDTO'

export default class GetByLoginController implements IController {
  constructor(private useCase: IUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(req: FastifyRequest, res: FastifyReply) {
    const request: IGetByLoginRequestDTO = {
      user: req.user,
    }

    const response = await this.useCase.execute(request)

    res.status(200).send(response)
  }
}
