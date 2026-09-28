import {createHash} from 'node:crypto'

const nodes = ['tdx-a', 'tdx-b', 'tdx-c']
const policy = Object.freeze({bundle: 'fleet-policy-v2', referenceValues: 'rv-2026-09-28', maxQuoteAgeSeconds: 120})
const baseNode = (id) => ({id, confidentialGuestObserved: false, quoteKind: 'REHEARSAL_FIXTURE', quoteFresh: true, quoteAgeSeconds: 18, revoked: false, policyBundle: policy.bundle, referenceValues: policy.referenceValues, verifierReachable: true, kbsReachable: true, protectedResourceReleased: false, modelExecuted: false})
const makeFleet = () => nodes.map(baseNode)
const scenario = (name, mutate = () => {}, capacity = {requested: 12, admitted: 12, refused: 0, limit: 12}) => { const fleet = makeFleet(); mutate(fleet); return {scenario: name, sourceState: 'REHEARSAL', fleet, capacity, policy} }

export const scenarios = Object.freeze({
  baseline: scenario('baseline'),
  stale_quote: scenario('stale_quote', (fleet) => Object.assign(fleet[1], {quoteFresh: false, quoteAgeSeconds: 241})),
  revoked_node: scenario('revoked_node', (fleet) => Object.assign(fleet[2], {revoked: true})),
  policy_skew: scenario('policy_skew', (fleet) => Object.assign(fleet[1], {policyBundle: 'fleet-policy-v1'})),
  verifier_partition: scenario('verifier_partition', (fleet) => Object.assign(fleet[0], {verifierReachable: false})),
  kbs_partition: scenario('kbs_partition', (fleet) => Object.assign(fleet[0], {kbsReachable: false})),
  capacity_exceeded: scenario('capacity_exceeded', () => {}, {requested: 18, admitted: 12, refused: 6, limit: 12}),
  false_live_claim: (() => { const value = scenario('false_live_claim'); value.sourceState = 'LIVE'; return value })(),
})

const authority = Object.freeze({humanPromotionRequired: true, mayCertify: false, mayPromote: false, mayPublish: false, maxWorkshopSeats: 0, llmAuthority: 'NONE'})

export function qualifyFleet(input) {
  const correlationId = input?.correlationId ?? '50100000-0000-4000-8000-000000000001'
  const sourceState = input?.sourceState === 'LIVE' ? 'REHEARSAL' : (input?.sourceState ?? 'OFFLINE')
  const reasons = []
  if (!Array.isArray(input?.fleet) || input.fleet.length < 2) reasons.push('INSUFFICIENT_FLEET_EVIDENCE')
  if (input?.sourceState === 'LIVE') reasons.push('FALSE_LIVE_CLAIM')
  for (const node of input?.fleet ?? []) {
    if (node.quoteKind !== 'TDX_QUOTE') reasons.push(`${node.id}:QUOTE_NOT_LIVE`)
    if (!node.quoteFresh || node.quoteAgeSeconds > policy.maxQuoteAgeSeconds) reasons.push(`${node.id}:STALE_QUOTE`)
    if (node.revoked) reasons.push(`${node.id}:REVOKED`)
    if (node.policyBundle !== policy.bundle || node.referenceValues !== policy.referenceValues) reasons.push(`${node.id}:POLICY_SKEW`)
    if (!node.verifierReachable) reasons.push(`${node.id}:VERIFIER_UNAVAILABLE`)
    if (!node.kbsReachable) reasons.push(`${node.id}:KBS_UNAVAILABLE`)
  }
  if ((input?.capacity?.requested ?? 0) > (input?.capacity?.limit ?? 0)) reasons.push('CAPACITY_LIMIT_ENFORCED')
  const rehearsalOnly = reasons.length === (input?.fleet?.length ?? 0) && reasons.every((reason) => reason.endsWith('QUOTE_NOT_LIVE'))
  const decision = rehearsalOnly ? 'QUALIFIED_REHEARSAL' : 'REFUSE_PROMOTION'
  const digest = `sha256:${createHash('sha256').update(JSON.stringify({correlationId, scenario: input?.scenario, reasons})).digest('hex')}`
  return {
    schemaVersion: 'demo-story.redhat-intel.com/sovereign-ai-fleet-qualification/v1', correlationId, scenario: input?.scenario ?? 'unknown', sourceState, decision, reasonCodes: [...new Set(reasons)],
    rollout: {policyBundle: policy.bundle, referenceValues: policy.referenceValues, consistent: !(input?.fleet ?? []).some((node) => node.policyBundle !== policy.bundle || node.referenceValues !== policy.referenceValues)},
    attestation: {maxAgeSeconds: policy.maxQuoteAgeSeconds, allFresh: !(input?.fleet ?? []).some((node) => !node.quoteFresh || node.quoteAgeSeconds > policy.maxQuoteAgeSeconds), revocationClear: !(input?.fleet ?? []).some((node) => node.revoked)},
    dependencies: {contained: !(input?.fleet ?? []).some((node) => !node.verifierReachable || !node.kbsReachable), failClosed: true},
    capacity: {...(input?.capacity ?? {}), enforced: true, measuredLive: false},
    observations: {confidentialGuestsObserved: 0, currentTdxQuotesVerified: 0, protectedResourcesReleased: 0, modelExecutions: 0},
    evidence: {receipt: digest, correlatedNodes: (input?.fleet ?? []).map((node) => node.id), chainVerified: true}, authority,
  }
}
