import {
  Action,
  Store,
  CLOSE,
  OPEN,
  WEBRTC_OFFER,
  SERVER,
  forEach,
  reduce
} from 'jiber-core'
import { Peer } from './peer'
import { ClientSettings } from '../interfaces/client-settings'
import { prefixFix } from './prefix-fix'

/**
 * When we join a , existing watchers send us offers (WEBRTC_OFFER)
 * When another user joins, we send an offer (we are now an existing member)
 * @hidden
 */
export class PeerManager {
  private store: Store
  private settings: ClientSettings
  private connections: {[uid: string]: Peer} = {}

  constructor (store: Store, settings: ClientSettings) {
    this.store = store
    this.settings = settings
    prefixFix()

    // add and remove connections as needed
    store.subscribe((state: any, action: Action) => {
      if (action.$src !== SERVER) return

      switch (action.type) {
        case CLOSE:
          return this.removeUnusedConnections()
        case OPEN:
          if (!action.$uid) return
          if (action.$uid === state.me.uid) return
          return this.addConnection(action.$uid)
        case WEBRTC_OFFER:
          if (!action.$uid) return
          return this.addConnection(action.$uid, action.offer)
      }
    })
  }

  // create a list of all uids that you should be connected to
  private allWatchers = (): string[] => {
    const state = this.store.getState()
    return reduce(state.watchers, (collector, user) => {
      return Object.assign(collector, { [user.uid]: user })
    }, {})
  }

  // remove a connection that we no longer want
  private remove = (uid: string): void => {
    const connection = this.connections[uid]
    if (!connection) return
    connection.close()
    delete this.connections[uid]
  }

  // remove connections we no longer want
  private removeUnusedConnections = () => {
    const allWatchers = this.allWatchers()
    forEach(this.connections, connection => {
      if (!allWatchers[connection.peerUserId]) this.remove(connection.peerUserId)
    })
  }

  // add a new connection
  private addConnection = (uid: string, offer?: any): void => {
    if (this.connections[uid]) return
    if (Object.keys(this.connections).length >= this.settings.maxPeers) return
    this.connections[uid] = new Peer(
      uid,
      this.store,
      this.settings,
      offer
    )
  }
}
