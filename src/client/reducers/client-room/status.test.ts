import status from './status'
import { confirmedState, leave, join } from '../../../core/index'
import { JOINED, NOT_JOINING, JOINING } from './status'

test('status is set on join success', () => {
  const state = ''
  const roomId = ''
  const result = {
    confirmedState: {},
    actionIds: {}
  }
  const action = confirmedState(roomId, result)
  expect(status(state, action)).toEqual(JOINED)
})

test('status is set on leave', () => {
  const state = ''
  const roomId = ''
  const action = leave(roomId)
  expect(status(state, action)).toEqual(NOT_JOINING)
})

test('status is set on join request', () => {
  const state = ''
  const roomId = ''
  const action = join(roomId)
  expect(status(state, action)).toEqual(JOINING)
})

test('status has a default', () => {
  const state = undefined
  const action = {type: 'whatev'}
  expect(status(state, action)).toEqual(NOT_JOINING)
})