import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 30,

	standardHeaders: true,
	legacyHeaders: false,

	message: {
		message: 'Too many requests. Please try again in 15 minutes.',
	},
});