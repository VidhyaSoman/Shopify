var express = require('express');
var router = express.Router();
var checkUser = require('../middleWare/checkUser');
var {
  getHomePage,
  getLoginPage,
  getRegisterPage,
  doRegister,
  doLogin,
  getMyOrder,
  addtocart,
  buyNow,
  getlogout,
  checkOut,
  payVerify,
  cartPage
} = require('../controllers/userController')

/* GET home page. */
router.get('/',getHomePage);
/* GET LOGIN PAGE. */
router.get('/login',getLoginPage);
/* GET REGISTER PAGE. */
router.get('/registers',getRegisterPage);
router.get('/myOrder',checkUser,getMyOrder);
router.post('/register',doRegister);
router.post('/login',doLogin);
router.get('/addtoCart/:id',addtocart);
router.get('/buynow/:id',checkUser,buyNow);
router.get('/checkout/:price',checkUser,checkOut)
router.post('/verify',payVerify);
router.get('/logout',getlogout);
router.get('/cart',cartPage)

module.exports = router;
