import { describe, it, expect } from 'bun:test';
import {
  CreateProjectSchema,
  CreateCommentSchema,
  CollaborationRequestSchema,
  RespondRequestSchema,
  CreateEventSchema,
  LoginSchema,
  SignupSchema,
  validateBody
} from '../src/lib/schemas';

describe('Strict Request Schema Validation (Audit Item #23)', () => {
  it('validates valid CreateProject payload', () => {
    const valid = {
      title: 'Decentralized Campus Voting',
      tagline: 'Transparent student election ledger',
      description: 'Building an open-source voting system on Ethereum and Next.js.',
      type: 'Hackathon',
      requiredSkills: ['Solidity', 'Next.js', 'TypeScript'],
      maxMembers: 4
    };
    const res = validateBody(CreateProjectSchema, valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.title).toBe('Decentralized Campus Voting');
      expect(res.data.type).toBe('Hackathon');
      expect(res.data.maxMembers).toBe(4);
    }
  });

  it('rejects invalid project with empty title or short description', () => {
    const invalid = {
      title: '  ',
      description: 'Too short',
      requiredSkills: []
    };
    const res = validateBody(CreateProjectSchema, invalid);
    expect(res.success).toBe(false);
  });

  it('validates CollaborationRequestSchema and enforces message minimum length', () => {
    const valid = {
      projectId: 'proj-123',
      receiverId: 'user-456',
      message: 'I would love to contribute my React skills to this hackathon project!'
    };
    const res = validateBody(CollaborationRequestSchema, valid);
    expect(res.success).toBe(true);

    const invalid = {
      projectId: 'proj-123',
      receiverId: 'user-456',
      message: 'hi' // too short (<3)
    };
    const invalidRes = validateBody(CollaborationRequestSchema, invalid);
    expect(invalidRes.success).toBe(false);
  });

  it('validates RespondRequestSchema and strictly allows accepted or declined', () => {
    expect(validateBody(RespondRequestSchema, { requestId: 'req-1', status: 'accepted' }).success).toBe(true);
    expect(validateBody(RespondRequestSchema, { requestId: 'req-1', status: 'declined' }).success).toBe(true);
    expect(validateBody(RespondRequestSchema, { requestId: 'req-1', status: 'maybe' }).success).toBe(false);
  });

  it('validates CreateCommentSchema and rejects empty content', () => {
    expect(validateBody(CreateCommentSchema, { content: 'Nice project pitch!' }).success).toBe(true);
    expect(validateBody(CreateCommentSchema, { content: '   ' }).success).toBe(false);
  });

  it('validates LoginSchema and requires valid email and password >= 6', () => {
    expect(validateBody(LoginSchema, { email: 'student@campus.edu', password: 'password123' }).success).toBe(true);
    expect(validateBody(LoginSchema, { email: 'not-an-email', password: 'password123' }).success).toBe(false);
    expect(validateBody(LoginSchema, { email: 'student@campus.edu', password: '123' }).success).toBe(false);
  });

  it('validates SignupSchema requires college, name, email, password >= 6', () => {
    const valid = {
      name: 'Alex Rivera',
      email: 'alex@mit.edu',
      password: 'securepassword123',
      college: 'MIT'
    };
    expect(validateBody(SignupSchema, valid).success).toBe(true);

    const missingCollege = {
      name: 'Alex Rivera',
      email: 'alex@mit.edu',
      password: 'securepassword123'
    };
    expect(validateBody(SignupSchema, missingCollege).success).toBe(false);
  });
});
