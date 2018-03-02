import { Action, Reducer } from '../interfaces'

export const filter = (reducer: Reducer, key: string, value: any) => (state: any, action: Action): any => {
  if (action[key] === value) {
    return reducer(state, action)
  }
  return state
}
