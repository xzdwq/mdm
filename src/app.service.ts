import { Injectable } from '@nestjs/common'
import logger from '@src/core/logger'

@Injectable()
export class AppService {
  getHello(): string {
    // logger.debug('this is debugs log', AppService.name)
    // logger.verbose('this is verbose log', AppService.name)
    // logger.info('this is information log', AppService.name)
    // logger.warn('this is warnings log', AppService.name)
    // logger.error('this is errors log', AppService.name)
    return 'Hello World!'
  }
}
