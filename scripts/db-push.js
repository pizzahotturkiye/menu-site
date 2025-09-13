#!/usr/bin/env node
/*
  Usage:
    node scripts/db-push.js                # uses .env
    node scripts/db-push.js --env .env.local
    node scripts/db-push.js --accept-data-loss
    node scripts/db-push.js --schema prisma/schema.prisma
*/

const { spawnSync } = require('node:child_process')
const { resolve } = require('node:path')
const fs = require('node:fs')

function parseArgs(argv) {
  const args = { env: '.env', acceptDataLoss: false, schema: undefined }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--env' && argv[i + 1]) {
      args.env = argv[++i]
    } else if (a === '--accept-data-loss') {
      args.acceptDataLoss = true
    } else if (a === '--schema' && argv[i + 1]) {
      args.schema = argv[++i]
    }
  }
  return args
}

function loadEnv(envFile) {
  const envPath = resolve(process.cwd(), envFile)
  if (!fs.existsSync(envPath)) {
    console.error(`Environment file not found: ${envPath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(envPath, 'utf8')
  const lines = content.split(/\r?\n/)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    // Support lines like: export KEY=VALUE
    const clean = line.startsWith('export ') ? line.slice(7).trim() : line
    const eqIdx = clean.indexOf('=')
    if (eqIdx === -1) continue
    const key = clean.slice(0, eqIdx).trim()
    let value = clean.slice(eqIdx + 1).trim()

    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function ensure(variableName) {
  const value = process.env[variableName]
  if (!value) {
    console.error(`Missing required env var: ${variableName}`)
    process.exit(1)
  }
}

function main() {
  console.log('🔧 DB Push Script Starting...')
  
  const args = parseArgs(process.argv)
  console.log(`📁 Loading environment from: ${args.env}`)
  
  try {
    loadEnv(args.env)
    console.log('✅ Environment loaded successfully')
  } catch (error) {
    console.error('❌ Failed to load environment:', error.message)
    process.exit(1)
  }

  // Ensure critical vars
  console.log('🔍 Checking required environment variables...')
  ensure('DATABASE_URL')
  console.log('✅ DATABASE_URL is set')

  const prismaArgs = ['prisma', 'db', 'push', '--skip-generate']
  if (args.schema) {
    prismaArgs.push('--schema', args.schema)
    console.log(`📋 Using schema: ${args.schema}`)
  }
  if (args.acceptDataLoss) {
    prismaArgs.push('--accept-data-loss')
    console.log('⚠️  Data loss accepted')
  } else {
    // Add --accept-data-loss by default for non-interactive usage
    prismaArgs.push('--accept-data-loss')
    console.log('⚠️  Data loss accepted (auto-added for non-interactive)')
  }

  console.log(`🚀 Running: npx ${prismaArgs.join(' ')}`)
  
  const npmCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const result = spawnSync(npmCmd, prismaArgs, {
    stdio: 'inherit',
    env: { ...process.env },
    shell: true
  })

  if (result.error) {
    console.error('❌ Spawn error:', result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    console.error(`❌ Command failed with exit code: ${result.status}`)
    process.exit(result.status || 1)
  }
  
  console.log('✅ Database push completed successfully!')
}

main()


