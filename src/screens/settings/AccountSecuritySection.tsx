'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { changeEmail, changePassword } from '@/actions/accountApi';

const MIN_PASSWORD_LENGTH = 8;
const inputClass =
  'w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mainOrange';
const buttonClass =
  'rounded-[7px] bg-darkStormy px-4 py-2 text-white transition-all hover:bg-mainDark disabled:opacity-50';

export function AccountSecuritySection({
  currentEmail,
}: {
  currentEmail: string | null | undefined;
}) {
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [emailPending, setEmailPending] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setEmailPending(true);
    setEmailStatus(null);
    try {
      await changeEmail(newEmail.trim());
      setEmailStatus('Check both your current and new inbox to confirm the change.');
      setEditingEmail(false);
      setNewEmail('');
    } catch (err) {
      console.error(err);
      setEmailStatus('Could not change the email. Try again later.');
    } finally {
      setEmailPending(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordStatus(`The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('The new passwords do not match.');
      return;
    }
    setPasswordPending(true);
    setPasswordStatus(null);
    try {
      const { error } = await changePassword({ currentPassword, newPassword });
      setPasswordStatus(error ?? 'Password changed.');
      if (!error) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setPasswordStatus('Could not change the password. Try again later.');
    } finally {
      setPasswordPending(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded bg-white p-4">
      <h2 className="text-xl font-semibold text-mainBlack">Account security</h2>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-600">Email</span>
        {editingEmail ? (
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email"
              className={inputClass}
            />
            <button type="submit" disabled={emailPending} className={buttonClass}>
              {emailPending ? 'Sending...' : 'Confirm'}
            </button>
            <button type="button" onClick={() => setEditingEmail(false)} className={buttonClass}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="font-medium">{currentEmail}</div>
            <button onClick={() => setEditingEmail(true)} className={buttonClass}>
              Change
            </button>
          </div>
        )}
        {emailStatus && <p className="text-sm text-darkStormy">{emailStatus}</p>}
      </div>

      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-2">
        <span className="text-sm text-gray-600">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className={inputClass}
        />
        <input
          type="password"
          required
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className={inputClass}
        />
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          className={inputClass}
        />
        <button type="submit" disabled={passwordPending} className={`${buttonClass} self-start`}>
          {passwordPending ? 'Saving...' : 'Change password'}
        </button>
        {passwordStatus && <p className="text-sm text-darkStormy">{passwordStatus}</p>}
      </form>
    </section>
  );
}
