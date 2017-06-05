import { Action, SERVER } from '../../core/index'
import {
  ADD_MEMBER,
  REMOVE_MEMBER,
  JOIN_RESULT,
  CONFIRMED_ACTION
} from './room-actions'

export default function reducer (
  state: {[key: string]: number} = {},
  action: Action
): {[key: string]: number} {
  switch (action.type) {
    case JOIN_RESULT:
      return action.actionIds

    case ADD_MEMBER:
      if (state[action.userId]) return state                                    // no need to be added twice
      return {...state, [action.userId]: action.actionId || 0}                  // add the userId to the collection

    case REMOVE_MEMBER:
      return {...state, [action.userId]: undefined}

    case CONFIRMED_ACTION:                                                      // trust confirmed actionId
      const meta = action.$hope
      return {...state, [meta.userId]: meta.actionId}

    default:
      return state
  }
}
