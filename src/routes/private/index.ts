import verifyJWT from '@/middleware/verifyJWT'
import { FastifyInstance } from 'fastify'
import actionsRoutes from './actions'
import authRoutes from './auth'
import checkListRoutes from './checkList'
import checkListControlRoutes from './checkListControl'
import checkListPeriodRoutes from './checkListPeriod'
import equipmentRoutes from './equipment'
import imageRoutes from './image'
import periodRoutes from './period'
import responsiblesRoutes from './responsibles'
import syncRoutes from './sync'

export default async function privateRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.register(authRoutes, {
    prefix: '/auth',
  })
  app.register(checkListRoutes, {
    prefix: '/checkList',
  })
  app.register(periodRoutes, {
    prefix: '/period',
  })
  app.register(equipmentRoutes, {
    prefix: '/equipment',
  })
  app.register(checkListPeriodRoutes, {
    prefix: '/checkListPeriod',
  })
  app.register(checkListControlRoutes, {
    prefix: '/checkListControl',
  })
  app.register(syncRoutes, {
    prefix: '/sync',
  })
  app.register(imageRoutes, {
    prefix: '/image',
  })
  app.register(responsiblesRoutes, {
    prefix: '/responsibles',
  })
  app.register(actionsRoutes, {
    prefix: '/actions',
  })
}
