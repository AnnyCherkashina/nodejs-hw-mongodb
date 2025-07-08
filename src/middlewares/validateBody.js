import createHttpError from 'http-errors';

export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, {
                abortEarly: false,
            });
        } catch (err) {
            next(createHttpError(400, err));
            // const error = createHttpError(400, 'Bad Request', {
            //   errors: err.details,
            // });
            // next(error);
        }
        next();
    };
};