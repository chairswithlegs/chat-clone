module.exports = (error, req, res, next) => {
    console.error(`Stack: ${error.stack}`);
    next(error);
}