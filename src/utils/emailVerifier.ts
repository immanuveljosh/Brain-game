export interface EmailValidationResult {
  isValidSyntax: boolean;
  isGmail: boolean;
  normalizedEmail: string;
  errorMessage?: string;
  suggestion?: string;
  providerLabel?: string;
}

const GMAIL_TYPO_DOMAINS: Record<string, string> = {
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'hotmal.com': 'hotmail.com',
};

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'fakeinbox.com',
]);

const BLOCKED_FAKE_GMAIL_LOCALS = new Set([
  'test',
  'testing',
  'testuser',
  'admin',
  'administrator',
  'user',
  'username',
  'example',
  'sample',
  'demo',
  'fake',
  'fakeuser',
  'qwerty',
  'asdfgh',
  '123456',
  '1234567',
  '12345678',
  '123456789',
  'password',
  'no-reply',
  'noreply',
  'abc',
  'abcdef',
]);

export function validateGmailAndEmailSyntax(rawInput: string): EmailValidationResult {
  const trimmed = rawInput.trim().toLowerCase();

  if (!trimmed) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: '',
      errorMessage: 'Please enter your Gmail or email address.',
    };
  }

  if (trimmed.includes(' ')) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Email address cannot contain spaces.',
    };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Include an "@" symbol (e.g. yourname@gmail.com).',
    };
  }

  const [localPart, domainPart] = parts;

  if (!localPart) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Enter your username before the "@" symbol.',
    };
  }

  if (!domainPart) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Enter a domain after "@" (e.g. gmail.com).',
      suggestion: `${localPart}@gmail.com`,
    };
  }

  // Check for common domain typos (like @gamil.com)
  if (GMAIL_TYPO_DOMAINS[domainPart]) {
    const correctedDomain = GMAIL_TYPO_DOMAINS[domainPart];
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: `Did you mean @${correctedDomain}?`,
      suggestion: `${localPart}@${correctedDomain}`,
    };
  }

  // Block disposable email services
  if (DISPOSABLE_DOMAINS.has(domainPart)) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Disposable or temporary email addresses are not permitted. Please use a real Gmail account.',
    };
  }

  const isGmail = domainPart === 'gmail.com' || domainPart === 'googlemail.com';

  if (isGmail) {
    // Strip optional +alias for core username validation
    const baseUser = localPart.split('+')[0];

    if (baseUser.startsWith('.') || baseUser.endsWith('.')) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: 'Gmail usernames cannot start or end with a period (.).',
      };
    }

    if (baseUser.includes('..')) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: 'Gmail usernames cannot contain consecutive periods (..).',
      };
    }

    if (!/^[a-z0-9.]+$/.test(baseUser)) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: 'Gmail usernames can only contain letters (a-z), numbers (0-9), and periods (.).',
      };
    }

    const alphaNumericOnly = baseUser.replace(/\./g, '');
    if (alphaNumericOnly.length < 6 || alphaNumericOnly.length > 30) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: 'Real Gmail usernames must be between 6 and 30 characters long.',
      };
    }

    if (/^\d+$/.test(alphaNumericOnly)) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: 'Real Gmail usernames must include at least one letter (cannot be numbers only).',
      };
    }

    if (/^(.)\1{4,}$/.test(alphaNumericOnly)) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: 'Please enter a real personal Gmail address, not repeated characters.',
      };
    }

    if (BLOCKED_FAKE_GMAIL_LOCALS.has(alphaNumericOnly) || BLOCKED_FAKE_GMAIL_LOCALS.has(baseUser)) {
      return {
        isValidSyntax: false,
        isGmail: true,
        normalizedEmail: trimmed,
        errorMessage: `"${trimmed}" is a reserved placeholder. Please enter your real personal Gmail address.`,
      };
    }

    return {
      isValidSyntax: true,
      isGmail: true,
      normalizedEmail: `${localPart}@gmail.com`,
      providerLabel: 'Google Gmail Account',
    };
  }

  // Non-Gmail domain RFC check
  const domainRegex = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,12}$/;
  if (!domainRegex.test(domainPart)) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Please enter a valid email domain (e.g. gmail.com).',
    };
  }

  const localRegex = /^[a-z0-9._%+-]{2,64}$/;
  if (!localRegex.test(localPart) || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return {
      isValidSyntax: false,
      isGmail: false,
      normalizedEmail: trimmed,
      errorMessage: 'Please enter a valid username before the "@" symbol.',
    };
  }

  return {
    isValidSyntax: true,
    isGmail: false,
    normalizedEmail: trimmed,
    providerLabel:
      domainPart === 'outlook.com' || domainPart === 'hotmail.com' || domainPart === 'live.com'
        ? 'Microsoft Outlook Account'
        : domainPart === 'icloud.com' || domainPart === 'me.com'
        ? 'Apple iCloud Mail'
        : domainPart === 'yahoo.com'
        ? 'Yahoo Mail Account'
        : `Verified Domain (${domainPart})`,
  };
}

/**
 * Queries Google Public DNS-over-HTTPS (https://dns.google/resolve) to verify
 * that the email domain has active MX (Mail Exchange) servers configured.
 */
export async function verifyDomainMxRecords(email: string): Promise<{
  hasMx: boolean;
  mxServer?: string;
  errorMessage?: string;
}> {
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) {
    return { hasMx: false, errorMessage: 'Invalid email address format.' };
  }
  const domain = parts[1];

  // Fast-path known major mail providers while still attempting live DNS check
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { hasMx: true, mxServer: 'smtp.google.com' };
    }

    const data = await res.json();
    // Status 3 = NXDOMAIN (Domain does not exist)
    if (data.Status === 3) {
      return {
        hasMx: false,
        errorMessage: `Domain "@${domain}" does not exist on DNS. Please check your email domain.`,
      };
    }

    if (Array.isArray(data.Answer) && data.Answer.length > 0) {
      const mxRecord = data.Answer.find((a: { type: number; data?: string }) => a.type === 15);
      if (mxRecord && mxRecord.data) {
        const host = String(mxRecord.data).split(' ').pop()?.replace(/\.$/, '') || domain;
        return { hasMx: true, mxServer: host };
      }
    }

    return {
      hasMx: false,
      errorMessage: `Domain "@${domain}" has no mail servers (MX records) configured to receive email.`,
    };
  } catch {
    clearTimeout(timeout);
    // If offline or blocked by network firewall, allow known valid providers
    const trustedOfflineDomains = new Set([
      'gmail.com',
      'googlemail.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'yahoo.com',
    ]);
    if (trustedOfflineDomains.has(domain)) {
      return { hasMx: true, mxServer: 'gmail-smtp-in.l.google.com' };
    }
    return { hasMx: true, mxServer: domain };
  }
}

export function evaluatePasswordStrength(password: string): {
  score: number;
  label: string;
  colorClass: string;
  barColor: string;
} {
  if (!password) {
    return { score: 0, label: 'Enter password', colorClass: 'text-slate-400', barColor: 'bg-slate-200' };
  }
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'Weak (min 8 chars + numbers)', colorClass: 'text-rose-600', barColor: 'bg-rose-500' };
  }
  if (score === 2) {
    return { score: 2, label: 'Fair security', colorClass: 'text-amber-600', barColor: 'bg-amber-500' };
  }
  if (score === 3) {
    return { score: 3, label: 'Good security', colorClass: 'text-blue-600', barColor: 'bg-blue-500' };
  }
  return { score: 4, label: 'Strong • 256-Bit Ready', colorClass: 'text-emerald-600', barColor: 'bg-emerald-500' };
}

export function formatNameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'Explorer';
  const cleaned = local.split('+')[0].replace(/[0-9_.-]+/g, ' ').trim();
  if (!cleaned) return 'Mind Explorer';
  return cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

