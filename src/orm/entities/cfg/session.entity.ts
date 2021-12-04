import { ISession } from 'connect-typeorm'
import {
  Column,
  Entity,
  Index,
  PrimaryColumn
} from 'typeorm'
import { Bigint } from 'typeorm-static'

@Entity({
  schema: 'cfg',
  name: 'sessions'
})
export class SessionEntity implements ISession {
  @Index()
  @Column('bigint', { transformer: Bigint })
  public expiredAt = Date.now()

  @PrimaryColumn('varchar', { length: 255 })
  public id: string = ''

  @Column('text')
  public json: string = ''
}