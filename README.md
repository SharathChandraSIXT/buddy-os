# 🤖 Buddy OS

> Role-Aware Autonomous Engineering OS for Cursor IDE

[![npm version](https://badge.fury.io/js/buddy-os.svg)](https://www.npmjs.com/package/buddy-os)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Install

```bash
npx buddy-os
```

That's it. One command, 60 seconds, you're operational.

## What is Buddy OS?

Buddy OS transforms Cursor from a code editor into a **Role-Aware Autonomous Engineering Operating System**.

### Core Capabilities

| Feature | Description |
|---------|-------------|
| 🔐 **Role-Based Permissions** | L1-L4 trust levels based on your role (SDE1 → Staff Engineer) |
| 📊 **Daily Planning** | Auto-prioritizes work using 12+ signals from Git, Slack, Jira, Calendar |
| 💡 **Autonomous Ideation** | Discovers improvements from code churn, Slack pain points, market trends |
| 🧹 **Stale Branch Intel** | Identifies branches to cleanup based on similarity to main |
| 🔥 **Context Pre-fetch** | Pre-loads relevant files when you fetch a ticket |
| 📝 **Rule Drafting** | Proposes new rules based on repeated fix patterns |
| 🛡️ **Flow Protection** | Never interrupts during deep work |

## Bundles

| Bundle | For | Autonomy |
|--------|-----|----------|
| **Starter** | SDE1/SDE2 | L1-L2 (Suggest + Confirm) |
| **Advanced IC** | SDE3/Senior | L2-L3 (Execute with audit) |
| **Tech Lead** | Staff/Principal | L3-L4 (Full autonomy) |
| **Enterprise** | Teams | Configurable + Compliance |

## Commands

Once installed, use these in Cursor:

```
/buddy              # Daily snapshot with priorities
/buddy focus        # Top 3 priorities only  
/buddy ideas        # View improvement backlog
/buddy cleanup      # Branch and stash cleanup
/buddy role show    # Current role and permissions
```

## Trust Levels

| Level | Name | Behavior |
|-------|------|----------|
| L1 | Analysis | Suggest only, no modifications |
| L2 | Drafting | Create artifacts for review |
| L3 | Action | Execute with audit logging |
| L4 | Critical | Human confirmation required |

## Non-Interactive Install

```bash
npx buddy-os --bundle techlead --role staff -y
```

**Bundles:** `starter`, `advanced`, `techlead`, `enterprise`  
**Roles:** `sde1`, `sde2`, `sde3`, `senior`, `staff`, `manager`, `product`

## What Gets Installed

```
.cursor/
├── buddy-state.json      # Configuration and learning state
├── buddy-audit.log       # Action audit trail
├── rules/                # 13 Cursor rules
│   ├── buddy.mdc         # Core Buddy logic
│   ├── a11y-standards.mdc
│   ├── component-structure.mdc
│   └── ... (10 more)
├── ideas/                # Ideation system
│   ├── backlog/
│   ├── ready/
│   └── archive/
└── drafts/               # Auto-generated rule drafts
```

## Enterprise Features

- 🔐 Role-based permission matrix
- 📋 Full audit logging  
- 🏢 Team-scoped visibility
- 🔄 Graceful MCP degradation
- 📊 Velocity metrics

## Contributing

1. Fork this repo
2. Create a feature branch
3. Submit a PR

## License

MIT © Buddy OS
