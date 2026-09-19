import { NextResponse } from 'next/server';
import { checkDBHealth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbHealth = await checkDBHealth();
  const uptime = process.uptime();

  const isHealthy = dbHealth.status === 'HEALTHY' || dbHealth.status === 'DEGRADED';

  return NextResponse.json({
    status: isHealthy ? 'UP' : 'DOWN',
    service: 'CampusCollab Full-Stack Production API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    database: {
      type: 'Amazon DynamoDB',
      status: dbHealth.status,
      table: dbHealth.table,
      latencyMs: dbHealth.latencyMs
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      awsRegion: process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1'
    }
  }, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
