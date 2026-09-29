import { redis } from "@/config/redis.js";

const recoveryRateLimitScript = `
local key = KEYS[1]

local now = tonumber(ARGV[1])
local windowStart = tonumber(ARGV[2])
local maxRequests = tonumber(ARGV[3])
local requestId = ARGV[4]
local ttl = tonumber(ARGV[5])

redis.call("ZREMRANGEBYSCORE", key, 0, windowStart)

local count = redis.call("ZCARD", key)

if count >= maxRequests then
    return 0
end

redis.call("ZADD", key, now, requestId)
redis.call("EXPIRE", key, ttl)

return 1
`;

class RateLimitService {
  async checkRecoveryLimit(identifier: string): Promise<boolean> {
  const key = `rateLimit:recovery:${identifier}`;

  const now = Date.now();
  const window = 5 * 60 * 1000;
  const windowStart = now - window;

  const requestId = crypto.randomUUID();

  const result = await redis.eval(
    recoveryRateLimitScript,
    1,
    key,
    now,
    windowStart,
    5,
    requestId,
    300
  );

  return result === 1;
}
}

export const rateLimitService = new RateLimitService();
