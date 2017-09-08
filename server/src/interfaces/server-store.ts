import { Store } from '../../core/index'
import { ServerState } from './server-state'

export interface ServerStore extends Store {
  getState: () => ServerState,
  start: () => void,
  stop: () => void
}