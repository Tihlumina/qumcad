# Structure
qumcad/
├── .kiro/
│ ├── specs/qumcad/ # requirements.md, design.md, tasks.md
│ ├── steering/ # product.md, tech.md, structure.md
│ └── hooks/ # pbt-on-save.json
├── src/
│ ├── lib/
│ │ ├── interlocking.ts # Lever state, Tappet matrix, presets, attemptPull / attemptRelease / applyOperation
│ │ ├── topology-oracle.ts # Independent physical oracle (P1, P2)
│ │ └── pbt-exorcist.ts # fast-check property suite
│ ├── test/ # Vitest suites (interlocking, oracle, PBT, reachability, dangerous-sequence)
│ └── ui/ # Lever-frame UI (vanilla TS + Vite)
├── index.html
├── package.json
├── tsconfig.json
└── README.md