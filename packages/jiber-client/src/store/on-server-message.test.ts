import { LOGIN_RESULT, STATE, OPEN, SELF } from 'jiber-core'
import * as sinon from 'sinon'
import { onServerMessage } from './on-server-message'
import { createClientStore } from './client-store'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let store: any
let sunDoc: any
let dispatch: sinon.SinonSpy

beforeEach(() => {
  store = createClientStore()
  sunDoc = store.open('sun')
  dispatch = sinon.spy(store, 'dispatch')
})

afterEach(() => {
  dispatch.restore()
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('send a join action for each doc in the state', () => {
  const strAction = JSON.stringify({ type: LOGIN_RESULT })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  const param = dispatch.getCall(0).args[0]
  expect(param.$docId).toBe('sun')
  expect(param.type).toBe(OPEN)
  expect(dispatch.callCount).toBe(2)
})

test('do nothing extra if the doc does not exist', () => {
  const strAction = JSON.stringify({ type: STATE, $docId: 'wowow' })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  expect(dispatch.callCount).toBe(1)
})

test('send optimistic actions from the docId', () => {
  // create an optimistic action
  sunDoc.dispatch({ type: 'TEST_ACTION', $src: SELF })
  expect(dispatch.getCall(0).args[0].type).toBe('TEST_ACTION')

  // simulate a LOGIN_RESULT from the server
  const strAction = JSON.stringify({ type: LOGIN_RESULT, $docId: 'sun' })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  expect(dispatch.getCall(1).args[0].type).toBe(OPEN)
  expect(dispatch.getCall(2).args[0].type).toBe('TEST_ACTION')
  expect(dispatch.getCall(3).args[0].type).toBe(LOGIN_RESULT)
  expect(dispatch.callCount).toBe(4)
})
