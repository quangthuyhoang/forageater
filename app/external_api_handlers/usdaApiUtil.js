// return rate limit and remaining rates from USDA API
const utils = {}
const rateLimit = (response) => {
    let remaining = response.headers['x-ratelimit-remaining'];
    let limit = response.headers['x-ratelimit-limit'];
    return {
        avialable_rates: remaining,
        rate_limit: limit
    }
}

utils.rateLimit = rateLimit;

module.exports = utils;