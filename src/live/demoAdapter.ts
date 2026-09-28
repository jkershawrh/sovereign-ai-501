import {createJsonAdapter, registerAdapter} from './adapters'

const collectedAt = '2026-09-28T23:00:00.000Z'
const steps = [
  ['fleet-baseline', 'QUALIFIED_REHEARSAL', 'REHEARSAL', 'Three correlated fixtures agree; zero live quotes observed'],
  ['fleet-rollout', 'REFUSE_PROMOTION', 'REHEARSAL', 'tdx-b policy bundle is one version behind'],
  ['fleet-revoke', 'REFUSE_PROMOTION', 'REHEARSAL', 'tdx-c revocation changes the next decision'],
  ['fleet-partition', 'REFUSE_PROMOTION', 'REHEARSAL', 'Verifier unavailable; affected path fails closed'],
  ['fleet-capacity', 'REFUSE_PROMOTION', 'REHEARSAL', '12 admitted · 6 refused · not measured live capacity'],
  ['fleet-correlate', 'HUMAN_REVIEW_REQUIRED', 'REHEARSAL', 'One receipt binds every node, condition, policy, and limit'],
] as const

for (const [id, decision, sourceState, outcome] of steps) registerAdapter(createJsonAdapter({id, url: `/api/v1/proof/${id}`, timeoutMs: 2_500, rehearsal: {data: {decision, sourceState, outcome}, collectedAt}}))
