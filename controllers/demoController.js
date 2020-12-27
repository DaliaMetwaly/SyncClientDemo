
exports.login = async (req, res, next) => {
  try {
    // const { payLoad } = req.body;

    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log(`error${error}`);
    next(error);
  }
};




