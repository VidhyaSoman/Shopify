var express = require('express');
var router = express.Router();
var {
    getadminLogin, login,
    getadminHome,
    addproductPage,
    addProduct
} = require('../controllers/adminController')

/* GET admin listing. */
router.get('/', getadminLogin);
router.post('/Login', login);
router.get('/home',getadminHome);
router.get('/addproduct',addproductPage)
router.post('/addproduct',addProduct);

module.exports = router;
