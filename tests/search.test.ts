import { describe, it, expect } from 'bun:test';
import { GET } from '../src/app/api/search/route';
import { POST } from '../src/app/api/match/route';

describe('Search & Matching Subsystems (Audit Items #13, #20, #21)', () => {
  it('handles search queries with filters gracefully', async () => {
    const req = new Request('http://localhost:3000/api/search?q=developer&type=all&limit=10', {
      method: 'GET'
    });
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.query.q).toBe('developer');
    expect(Array.isArray(data.students)).toBe(true);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.page).toBe(1);
  });

  it('validates matching queries and outputs transparent confidence tiers', async () => {
    const req = new Request('http://localhost:3000/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Looking for a skilled React and TypeScript frontend developer to build a modern dashboard.'
      })
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.extractedRequirements.skills).toContain('React');
    expect(data.extractedRequirements.skills).toContain('TypeScript');
    expect(data.extractedRequirements.targetRoles).toContain('Frontend Developer');
    expect(Array.isArray(data.topMatches)).toBe(true);

    if (data.topMatches.length > 0) {
      const first = data.topMatches[0];
      expect(first.confidenceTier).toBeDefined();
      expect(['Strong Match', 'Good Match', 'Potential Fit']).toContain(first.confidenceTier);
      expect(first.scoreBreakdown).toBeDefined();
      expect(typeof first.scoreBreakdown.skillFit).toBe('number');
      expect(typeof first.scoreBreakdown.roleFit).toBe('number');
      expect(typeof first.scoreBreakdown.availabilityFit).toBe('number');
      expect(Array.isArray(first.reasons)).toBe(true);
    }
  });

  it('rejects matching requests without prompt', async () => {
    const req = new Request('http://localhost:3000/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '' })
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
