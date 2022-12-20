import rateLimitExpress from 'express-rate-limit';

export default function rateLimit(rate?: number, timeLimit?: number) {
  return rateLimitExpress({
    windowMs: timeLimit ? timeLimit * 60 * 1000 : 10 * 60 * 1000, // 10 minutes
    max: rate || 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
}
