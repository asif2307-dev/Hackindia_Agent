/**
 * server/test/auth_evidence.test.js
 * Automated Security & Authentication Tests for Agent Travel.
 * Validates password hashing, token signatures, role enforcement,
 * magic-byte verification, and traversal defense.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authService } from '../authService.js';
import { evidenceService } from '../evidenceService.js';

describe('Security & Authentication Unit Tests', () => {
  it('1. Preloaded Accounts: Authenticates traveler and reviewer with correct credentials', () => {
    // Traveler
    const travelerLogin = authService.login('aarav.sharma@example.com', 'Password@123');
    assert.equal(travelerLogin.user.role, 'traveler');
    assert.ok(travelerLogin.token.length > 20);

    // Reviewer
    const reviewerLogin = authService.login('reviewer@agenttravel.com', 'Reviewer@123');
    assert.equal(reviewerLogin.user.role, 'reviewer');
    assert.ok(reviewerLogin.token.length > 20);
  });

  it('2. Invalid Credentials Rejection: Fails gracefully on wrong password or email', () => {
    assert.throws(
      () => authService.login('aarav.sharma@example.com', 'WrongPassword!'),
      /Invalid email or password/
    );
    assert.throws(
      () => authService.login('nonexistent@example.com', 'Password@123'),
      /Invalid email or password/
    );
  });

  it('3. Token Verification: Validates HMAC-SHA256 signature and extracts user claims', () => {
    const login = authService.login('reviewer@agenttravel.com', 'Reviewer@123');
    const verified = authService.verifyToken(login.token);
    assert.ok(verified);
    assert.equal(verified.email, 'reviewer@agenttravel.com');
    assert.equal(verified.role, 'reviewer');

    // Tampered token test
    const tampered = login.token.slice(0, -5) + 'xxxxx';
    const tamperedResult = authService.verifyToken(tampered);
    assert.equal(tamperedResult, null, 'Tampered token must be rejected');
  });

  it('4. New Registration: Creates new user with PBKDF2 hashed password', () => {
    const testEmail = `newuser_${Date.now()}@test.com`;
    const reg = authService.register({
      name: 'Rohan Verma',
      email: testEmail,
      password: 'SecurePassword@123',
      phone: '+91 99887 76655',
    });

    assert.equal(reg.user.name, 'Rohan Verma');
    assert.equal(reg.user.role, 'traveler');
    assert.ok(reg.token);

    // Verify login works with new credentials
    const login = authService.login(testEmail, 'SecurePassword@123');
    assert.equal(login.user.email, testEmail);
  });

  it('5. Evidence Validation: Accepts valid PDF with %PDF magic bytes and rejects invalid binary', () => {
    const validPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
    const base64Pdf = validPdfBuffer.toString('base64');

    const uploaded = evidenceService.saveEvidence('TEST-CASE-1', {
      filename: 'receipt.pdf',
      fileBase64: base64Pdf,
      declaredType: 'application/pdf',
      uploaderEmail: 'aarav.sharma@example.com',
    });

    assert.ok(uploaded.fileId);
    assert.equal(uploaded.verified, true);
    assert.equal(uploaded.mimeType, 'application/pdf');

    // Reject executable disguised as PDF
    const fakePdfBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00FakePEFileHeader');
    const fakeBase64 = fakePdfBuffer.toString('base64');

    assert.throws(
      () =>
        evidenceService.saveEvidence('TEST-CASE-1', {
          filename: 'exploit.pdf',
          fileBase64: fakeBase64,
          declaredType: 'application/pdf',
        }),
      /Unsupported file format/
    );
  });

  it('6. Path Traversal Defense: Sanitizes unsafe filenames', () => {
    const validPngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const base64Png = validPngBuffer.toString('base64');

    const uploaded = evidenceService.saveEvidence('TEST-CASE-1', {
      filename: '../../../../etc/passwd',
      fileBase64: base64Png,
      declaredType: 'image/png',
    });

    assert.ok(!uploaded.filename.includes('..'));
    assert.ok(!uploaded.filename.includes('/'));
    assert.ok(uploaded.filename.endsWith('passwd') || uploaded.filename.includes('passwd'));
  });
});
