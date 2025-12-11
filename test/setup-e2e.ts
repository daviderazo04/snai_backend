import crypto from 'crypto';

// Some dependencies expect a global crypto; provide the Node module if missing
if (typeof (global as unknown as { crypto?: unknown }).crypto === 'undefined') {
  (global as unknown as { crypto: unknown }).crypto = crypto;
}
