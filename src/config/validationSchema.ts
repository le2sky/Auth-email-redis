import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'stage')
    .default('development'),
  PORT: Joi.number().default(3000),
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPRIRE_IN: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
  IMG_HOST_URL: Joi.string().required(),
});
