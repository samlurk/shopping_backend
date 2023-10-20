import crypto from 'crypto';
import { type JwtPayload, sign, verify, decode } from 'jsonwebtoken';
import { unauthorized } from './api-response.helper';
const JWT_SECRET = process.env.JWT_SECRET as string;

// Generate a JWT token for a given payload and secret
export const generateToken = async (payload: object, expiresIn = '2h'): Promise<string> => {
  // Convert payload to a JSON string
  const payloadString = JSON.stringify(payload);

  // Create a signature for the payload using the secret key
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadString).digest('base64');

  // Encode the payload and signature as a JWT token
  return sign({ payload, signature }, JWT_SECRET, { expiresIn });
};

// Verify the authenticity of a JWT token
export const verifyToken = async (token: string): Promise<string | JwtPayload | Error> => {
  // Decode the token into its payload and signature components
  const decodedToken = decode(token) as JwtPayload | null;

  if (decodedToken === null) throw unauthorized('auth/access-denied');
  // Verify the signature using the secret key
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(JSON.stringify(decodedToken.payload))
    .digest('base64');
  if (decodedToken.signature !== signature) throw unauthorized('auth/invalid-token-signature');

  // Verify that the token has not expired
  verify(token, JWT_SECRET, (err, _) => {
    if (err !== null) throw unauthorized('auth/token-expired');
  });

  // If all checks pass, return the payload
  return decodedToken.payload;
};
