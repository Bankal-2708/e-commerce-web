// chek krta h ki user seller h ya nhi

export const sellerOnly = (req, res, next) => {
  if (req.user?.userRole !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Only sellers can access this route',
    });
  }
  next();
};