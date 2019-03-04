import { v4 as uuidv4 } from 'uuid'

export interface PacketConfig {
  payload?: any,
  time?: number,
  trust?: number
  id?: string,
  doc?: string,
  type?: string,
  user?: any,
  conn?: any
}

export class Packet {
  public id: string = uuidv4()
  public payload: any = undefined
  public time: number = 0
  public trust: number = 0
  public doc: string = 'default'
  public type?: string = undefined
  public user: any = undefined
  public conn: string = 'default'

  constructor (config?: PacketConfig) {
    if (config) Object.assign(this, config)
  }
}
