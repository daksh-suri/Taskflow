const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API running'
  });
};

module.exports = { healthCheck };
