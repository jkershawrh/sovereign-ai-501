import type { DemoConfig } from './types'

const technicalTopology = {
  boundary: {label: 'fleet trust ↔ promotion authority', detail: 'qualification evidence never certifies itself'},
  entry: {id: 'operator', kind: 'operator', label: 'Qualification operator', detail: 'selects a named condition'},
  primaryPath: [
    {id: 'fleet', kind: 'deployment', label: 'TDX workload fleet', detail: 'node-scoped evidence and identity', endpoint: '3 rehearsal nodes', edgeLabel: 'collects'},
    {id: 'verifier', kind: 'service', label: 'Trustee verifier boundary', detail: 'freshness, revocation, reference values', endpoint: 'attestation API', edgeLabel: 'appraises'},
    {id: 'kbs', kind: 'service', label: 'KBS policy boundary', detail: 'versioned protected-resource rules', endpoint: 'policy API', edgeLabel: 'decides'},
    {id: 'ledger', kind: 'data', label: 'Correlated receipt', detail: 'condition + node + policy + capacity', endpoint: 'receipt/v1', edgeLabel: 'binds'},
  ],
  supportPath: [
    {id: 'rollout', kind: 'policy', label: 'Rollout controller', detail: 'rejects policy or reference-value skew', edgeLabel: 'versions'},
    {id: 'capacity', kind: 'policy', label: 'Admission limit', detail: 'refuses beyond declared rehearsal bound', edgeLabel: 'contains'},
    {id: 'human', kind: 'authority', label: 'Human reviewer', detail: 'certify · promote · publish remain false', edgeLabel: 'retains authority'},
  ],
}

export const demoConfig: DemoConfig = {
  id: 'sovereign-ai-501', title: 'Sovereign AI 501 — Qualify a Confidential AI Fleet', subtitle: 'Scale trust without scaling assumptions', event: 'Confidential AI qualification review', audience: 'Platform, security, AI, and risk teams', cta: 'Qualify the fleet envelope; keep promotion human.',
  brand: {primary: {name: 'Red Hat', logo: '/logos/redhat.svg', alt: 'Red Hat'}, partner: {name: 'Intel', logo: '/logos/intel.png', alt: 'Intel'}, attribution: 'Red Hat × Intel'},
  acts: [
    {id: 'stakes', label: '00', title: 'Fleet Risk', scenes: [
      {id: 'intro', type: 'intro', beat: 'ordinary-world', title: 'One trusted node is not a qualified fleet', subtitle: 'Rollout, freshness, revocation, dependencies, and load can disagree', speakerPrompt: 'State REHEARSAL before any interpretation. No live TDX guest, quote, Trustee/KBS, protected resource, or model execution is observed.'},
      {id: 'reframe', type: 'reframe', beat: 'stakes', eyebrow: 'The 501 shift', title: 'Qualify change, not one happy path', before: 'Node-by-node pass', after: 'Fleet-wide evidence envelope', detail: 'Every condition must stay correlated, fail closed, and stop at human review.', speakerPrompt: 'Explain why 401 operation is the foundation and why 501 adds fleet-wide qualification.'},
    ]},
    {id: 'architecture', label: '01', title: 'Causal Architecture', scenes: [
      {id: 'guided-architecture', type: 'guided-architecture', beat: 'system-reveal', eyebrow: 'Qualification envelope', title: 'Five questions earn one candidate receipt', body: 'Reveal only the boundary that answers the current question.', layers: [
        {id: 'identity', component: 'Fleet identity', tone: 'partner', question: 'What must agree across nodes?', answer: 'Workload identity, policy bundle, reference values, and current evidence.', detail: 'A node without current hardware evidence cannot contribute a LIVE result.', activeNodeIds: ['fleet']},
        {id: 'freshness', component: 'Freshness + revocation', tone: 'primary', question: 'When does yesterday’s trust expire?', answer: 'At the freshness window, revocation event, or reference-value change.', detail: 'The next decision refuses stale or revoked evidence.', activeNodeIds: ['verifier', 'rollout']},
        {id: 'dependency', component: 'Failure containment', tone: 'partner', question: 'What happens when verification or key policy disappears?', answer: 'Only the affected path fails closed; no cached success becomes authority.', detail: 'Verifier and KBS reachability are explicit evidence.', activeNodeIds: ['verifier', 'kbs']},
        {id: 'capacity', component: 'Admission', tone: 'success', question: 'What happens beyond the declared concurrency bound?', answer: 'Excess work is refused and recorded, never silently overcommitted.', detail: 'Factory numbers are fixtures, not measured production capacity.', activeNodeIds: ['capacity', 'ledger']},
        {id: 'authority', component: 'Human promotion', tone: 'primary', question: 'Who can move the candidate forward?', answer: 'A named human after independent Launchpad certification.', detail: 'Factory, policy, receipt, and model all have zero promotion authority.', activeNodeIds: ['human']},
      ], technicalTopology, speakerPrompt: 'Pause on each question, then reveal the runtime boundary and its refusal behavior.'},
    ]},
    {id: 'proof', label: '02', title: 'Changed Conditions', scenes: [
      {id: 'live', type: 'live-journey', beat: 'live-proof', eyebrow: 'REHEARSAL · deterministic fixtures', title: 'Run every condition through the same fleet path', body: 'Evidence accumulates across a baseline, rollout skew, revocation, dependency loss, and admission pressure.', cta: 'Run fleet qualification', workspace: {label: 'Open the separate Showroom lab', href: '/lab/'}, nodes: [
        {id: 'baseline', label: 'Baseline', detail: 'coherent fleet', tone: 'success'}, {id: 'rollout', label: 'Rollout', detail: 'policy skew', tone: 'primary'}, {id: 'revoke', label: 'Revoke', detail: 'node withdrawn', tone: 'partner'}, {id: 'partition', label: 'Partition', detail: 'verifier unavailable', tone: 'primary'}, {id: 'saturate', label: 'Saturate', detail: 'admission limit', tone: 'partner'}, {id: 'correlate', label: 'Correlate', detail: 'one receipt chain', tone: 'success'},
      ], technicalTopology, steps: [
        {id: 'baseline', title: 'Establish the rehearsal baseline', detail: 'Three synthetic node records agree on policy and reference values; no quote is hardware-rooted.', adapterId: 'fleet-baseline', activeNode: 0, activeNodeIds: ['fleet', 'ledger'], resultFields: [{key: 'decision', label: 'Decision'}, {key: 'sourceState', label: 'Source'}, {key: 'outcome', label: 'Evidence'}]},
        {id: 'rollout', title: 'Introduce policy skew', detail: 'One node remains on the previous bundle and the fleet refuses promotion.', adapterId: 'fleet-rollout', activeNode: 1, activeNodeIds: ['rollout', 'ledger'], resultFields: [{key: 'decision', label: 'Decision'}, {key: 'sourceState', label: 'Source'}, {key: 'outcome', label: 'Reason'}]},
        {id: 'revoke', title: 'Revoke one node', detail: 'Revocation changes the next decision without converting the other nodes into proof.', adapterId: 'fleet-revoke', activeNode: 2, activeNodeIds: ['verifier', 'fleet'], resultFields: [{key: 'decision', label: 'Decision'}, {key: 'sourceState', label: 'Source'}, {key: 'outcome', label: 'Reason'}]},
        {id: 'partition', title: 'Partition the verifier', detail: 'The affected path abstains; cached evidence does not authorize a protected resource.', adapterId: 'fleet-partition', activeNode: 3, activeNodeIds: ['verifier', 'kbs'], resultFields: [{key: 'decision', label: 'Decision'}, {key: 'sourceState', label: 'Source'}, {key: 'outcome', label: 'Containment'}]},
        {id: 'saturate', title: 'Exceed the admission limit', detail: 'The rehearsal admits 12 and refuses 6; this tests logic, not production capacity.', adapterId: 'fleet-capacity', activeNode: 4, activeNodeIds: ['capacity', 'ledger'], resultFields: [{key: 'decision', label: 'Decision'}, {key: 'sourceState', label: 'Source'}, {key: 'outcome', label: 'Admission'}]},
        {id: 'correlate', title: 'Bind the evidence chain', detail: 'One correlation identifier links nodes, condition, policy, capacity, and retained authority.', adapterId: 'fleet-correlate', activeNode: 5, activeNodeIds: ['ledger', 'human'], resultFields: [{key: 'decision', label: 'Decision'}, {key: 'sourceState', label: 'Source'}, {key: 'outcome', label: 'Receipt'}]},
      ], speakerPrompt: 'Keep every completed result visible. Call the admission count a fixture, never a measured scale claim.'},
      {id: 'trial', type: 'comparison', beat: 'trials', title: 'Unsafe evidence cannot outrun the boundary', columns: [
        {label: 'Coherent rehearsal', value: 'Candidate receipt', detail: 'Useful for control-flow review; never certification.', tone: 'success'},
        {label: 'Skew · stale · revoked · partitioned · saturated', value: 'REFUSE PROMOTION', detail: 'Exact reason stays correlated to node and condition.', tone: 'partner'},
      ], speakerPrompt: 'Distinguish a passing rehearsal candidate from live qualification.'},
    ]},
    {id: 'mechanism', label: '03', title: 'Why It Holds', scenes: [
      {id: 'mechanisms', type: 'mechanisms', beat: 'trials', eyebrow: 'Qualification mechanics', title: 'Scale the evidence before scaling authority', body: 'Three mechanisms make changed conditions reviewable.', mechanisms: [
        {id: 'version', label: 'Version everything', claim: 'Policy and reference values move as a reviewed pair.', detail: 'Skew is visible and blocks the fleet.', tone: 'primary'},
        {id: 'correlation', label: 'Correlate every result', claim: 'Node, condition, dependency, and capacity share one receipt.', detail: 'A reviewer can reconstruct why the decision changed.', tone: 'partner'},
        {id: 'authority', label: 'Retain human control', claim: 'Evidence requests review; it cannot promote itself.', detail: 'Certification, ordering, and publication remain false.', tone: 'success'},
      ], speakerPrompt: 'Connect each mechanism to a result already collected in this browser session.'},
    ]},
    {id: 'handoff', label: '04', title: 'Candidate Boundary', scenes: [
      {id: 'payoff', type: 'evidence-payoff', beat: 'transformation', eyebrow: 'Immutable factory candidate', title: 'Review-ready does not mean certified', adapterIds: ['fleet-rollout', 'fleet-capacity', 'fleet-correlate'], fallbackLine: 'Run the rehearsal to populate this candidate receipt', evidenceFields: [{key: 'decision', label: 'Latest decision'}, {key: 'sourceState', label: 'Evidence source'}, {key: 'outcome', label: 'Observed boundary'}], line1: 'The fleet contract survives controlled change.', line2: 'Every authority remains false until independent certification.', cta: 'Continue into the separate 75–90 minute Showroom lab →', speakerPrompt: 'Name the LIVE blockers and explicitly close the presentation before opening the lab.'},
    ]},
  ],
  journeyHandoffs: [{depth: 'lab', title: 'Sovereign AI 501 Showroom', duration: '75–90 minutes', question: 'Can the learner build, break, qualify, and explain the fleet envelope?', technology: 'REHEARSAL fleet · policy rollout · failure matrix · correlated receipt', instruction: 'Complete all conditions, export the receipt, and record every LIVE blocker.', href: '/lab/'}],
}
