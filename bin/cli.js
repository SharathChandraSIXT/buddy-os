#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const VERSION = '5.0.3';
const CURSOR_DIR = '.cursor';

// Parse command line flags
function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--bundle' && args[i + 1]) {
      flags.bundle = args[++i];
    } else if (args[i] === '--role' && args[i + 1]) {
      flags.role = args[++i];
    } else if (args[i] === '-y' || args[i] === '--yes') {
      flags.yes = true;
    }
  }
  return flags;
}

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}i${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}!${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}x${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

const BUNDLES = {
  starter: {
    name: 'Starter (SDE1/SDE2)',
    autonomy: 'L1-L2',
    rules: ['web-standards', 'component-structure', 'a11y-standards', 'form-patterns'],
    description: 'Basic code quality and accessibility enforcement'
  },
  advanced: {
    name: 'Advanced IC (SDE3/Senior)',
    autonomy: 'L2-L3',
    rules: ['web-standards', 'component-structure', 'a11y-standards', 'form-patterns',
            'buddy', 'buddy-guard', 'ideation-engine', 'context-warm'],
    description: 'Full Buddy capabilities with intelligent assistance'
  },
  techlead: {
    name: 'Tech Lead (Staff/Principal)',
    autonomy: 'L3-L4',
    rules: ['*'],
    description: 'Complete Buddy OS with role-based permissions and team visibility'
  },
  enterprise: {
    name: 'Enterprise',
    autonomy: 'Configurable',
    rules: ['*'],
    description: 'Full system with audit logging, compliance, and multi-team support'
  }
};

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRules(bundle, targetDir) {
  const rulesDir = path.join(__dirname, '..', 'rules');
  const targetRulesDir = path.join(targetDir, 'rules');
  ensureDir(targetRulesDir);

  const files = fs.readdirSync(rulesDir);
  let copied = 0;

  files.forEach(file => {
    if (file.endsWith('.mdc')) {
      const ruleName = file.replace('.mdc', '');
      if (bundle.rules.includes('*') || bundle.rules.includes(ruleName)) {
        fs.copyFileSync(
          path.join(rulesDir, file),
          path.join(targetRulesDir, file)
        );
        copied++;
      }
    }
  });

  return copied;
}

function createStateFile(targetDir, role, bundle) {
  const state = {
    version: VERSION,
    last_run: new Date().toISOString(),
    session_count: 0,
    first_session: new Date().toISOString().split('T')[0],
    yolo_mode: false,
    role_system: {
      current_role: role,
      bundle: bundle,
      autonomy_level: BUNDLES[bundle].autonomy,
      role_detected_from: 'cli_install',
      onboarding_completed: false
    },
    audit_log: {
      enabled: true,
      log_file: '.cursor/buddy-audit.log',
      retention_days: 30
    }
  };

  fs.writeFileSync(
    path.join(targetDir, 'buddy-state.json'),
    JSON.stringify(state, null, 2)
  );
}

function createAuditLog(targetDir) {
  const header = `# Buddy OS v${VERSION} Audit Log\n# Format: JSON lines\n# Retention: 30 days\n\n`;
  fs.writeFileSync(path.join(targetDir, 'buddy-audit.log'), header);
}

function createStructure(targetDir) {
  const dirs = [
    'ideas/backlog',
    'ideas/ready',
    'ideas/in-progress',
    'ideas/archive',
    'drafts'
  ];

  dirs.forEach(dir => {
    ensureDir(path.join(targetDir, dir));
    fs.writeFileSync(path.join(targetDir, dir, '.gitkeep'), '');
  });
}

async function init(flags = {}) {
  console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 BUDDY OS v${VERSION} - Role-Aware Autonomous Engineering OS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`);

  const cursorDir = path.join(process.cwd(), CURSOR_DIR);
  if (fs.existsSync(path.join(cursorDir, 'buddy-state.json'))) {
    if (!flags.yes) {
      const answer = await prompt('Buddy OS already installed. Upgrade? (y/N): ');
      if (answer.toLowerCase() !== 'y') {
        log.info('Installation cancelled');
        process.exit(0);
      }
    }
  }

  let bundle, role;
  const bundleMap = { '1': 'starter', '2': 'advanced', '3': 'techlead', '4': 'enterprise',
                      'starter': 'starter', 'advanced': 'advanced', 'techlead': 'techlead', 'enterprise': 'enterprise' };
  const roleMap = {
    '1': 'SDE1', '2': 'SDE2', '3': 'SDE3', '4': 'Senior_SDE',
    '5': 'Staff_Engineer', '6': 'Engineering_Manager', '7': 'Product_Owner',
    'sde1': 'SDE1', 'sde2': 'SDE2', 'sde3': 'SDE3', 'senior': 'Senior_SDE',
    'staff': 'Staff_Engineer', 'manager': 'Engineering_Manager', 'product': 'Product_Owner'
  };

  if (flags.bundle) {
    bundle = bundleMap[flags.bundle.toLowerCase()] || 'techlead';
    log.info(`Bundle: ${BUNDLES[bundle].name}`);
  } else {
    log.header('Select your bundle:');
    console.log('  [1] Starter      - SDE1/SDE2, basic enforcement');
    console.log('  [2] Advanced IC  - SDE3/Senior, full Buddy');
    console.log('  [3] Tech Lead    - Staff/Principal, complete system');
    console.log('  [4] Enterprise   - Multi-team, compliance, audit');
    console.log('');
    const bundleChoice = await prompt('Bundle (1-4) [3]: ') || '3';
    bundle = bundleMap[bundleChoice] || 'techlead';
  }

  if (flags.role) {
    role = roleMap[flags.role.toLowerCase()] || 'Staff_Engineer';
    log.info(`Role: ${role}`);
  } else {
    log.header('Select your role:');
    console.log('  [1] SDE1 (Junior)');
    console.log('  [2] SDE2 (Mid-level)');
    console.log('  [3] SDE3 (Senior)');
    console.log('  [4] Senior SDE (Lead IC)');
    console.log('  [5] Staff Engineer (Principal)');
    console.log('  [6] Engineering Manager');
    console.log('  [7] Product Owner');
    console.log('');
    const roleChoice = await prompt('Role (1-7) [5]: ') || '5';
    role = roleMap[roleChoice] || 'Staff_Engineer';
  }

  log.header('Installing Buddy OS...');
  ensureDir(cursorDir);

  const rulesCopied = copyRules(BUNDLES[bundle], cursorDir);
  log.success(`${rulesCopied} rules installed`);

  createStructure(cursorDir);
  log.success('Directory structure created');

  createStateFile(cursorDir, role, bundle);
  log.success('Configuration initialized');

  createAuditLog(cursorDir);
  log.success('Audit logging enabled');

  console.log(`
${colors.bold}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BUDDY OS v${VERSION} INSTALLED SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Bundle:${colors.reset} ${BUNDLES[bundle].name}
${colors.cyan}Role:${colors.reset}   ${role}
${colors.cyan}Autonomy:${colors.reset} ${BUNDLES[bundle].autonomy}

${colors.bold}Next Steps:${colors.reset}
  1. Open Cursor in this directory
  2. Type ${colors.cyan}/buddy${colors.reset} to see your daily snapshot
  3. Explore ${colors.cyan}/buddy ideas${colors.reset} for improvement suggestions

${colors.yellow}GitHub:${colors.reset} https://github.com/SharathChandraSIXT/buddy-os

`);
}

const args = process.argv.slice(2);
const flags = parseFlags(args);
const command = args.find(a => !a.startsWith('-') && !['starter', 'advanced', 'techlead', 'enterprise', 'sde1', 'sde2', 'sde3', 'senior', 'staff', 'manager', 'product'].includes(a.toLowerCase()));

switch (command) {
  case 'init':
  case undefined:
    init(flags);
    break;
  case 'version':
    console.log(`Buddy OS v${VERSION}`);
    break;
  case 'help':
    console.log(`
Buddy OS v${VERSION} - Role-Aware Autonomous Engineering OS

Usage:
  npx buddy-os                         Install/upgrade (interactive)
  npx buddy-os --bundle techlead       Non-interactive install
  npx buddy-os --role staff -y         Skip prompts

Options:
  --bundle <type>   starter | advanced | techlead | enterprise
  --role <role>     sde1 | sde2 | sde3 | senior | staff | manager | product
  -y, --yes         Skip confirmation prompts

Commands:
  init              Initialize in current directory
  version, -v       Show version
  help, -h          Show this help

GitHub: https://github.com/SharathChandraSIXT/buddy-os
`);
    break;
  default:
    if (command && !command.startsWith('-')) {
      log.error(`Unknown command: ${command}`);
      process.exit(1);
    }
    init(flags);
}
