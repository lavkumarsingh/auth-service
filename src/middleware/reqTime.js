export const reqTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};
