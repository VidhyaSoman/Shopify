var con = require('../config/config')
let productModel = require('../Models/productModel')

const getadminLogin = (req,res) =>
{
    res.render('Admin/adminLogin');
}

const login = (req,res) =>
{
    let username = 'admin';
    let password = '1234';
    if(req.body.username==username && req.body.password==password)
    {
        console.log('login succesfully');
        res.redirect('/admin/home');
    }
    else{
        console.log('login error');
        res.redirect('/admin');
    }
}

const getadminHome =(req,res) =>
{
    res.render('Admin/adminHome');
}

const addproductPage = (req,res) =>
{
    res.render('Admin/addProduct');
}

const addProduct = async (req,res) =>
{
    // console.log(req.body);
    // console.log(req.files);
    let file = req.files.image;
    const {name} = req.files.image;
    req.body.image = name;
    console.log(req.body);
    // var data = req.body;
    try {
        let product = await productModel.create(req.body);
        file.mv('public/images/Products/'+product._id,(err)=>
        {
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect('/admin/addproduct');
            }
        
    }) 
    }
    catch (error) {
        console.log(error)
    }
}
//         else
//         {
//             let sql="insert into products set ?";
//             con.query(sql,data,(err,row) =>
//             {
//                 if(err)
//                 {
//                     console.log(err);
//                 }
                
//             })
//         }
//     })
// }
module.exports = {
    getadminLogin,
    login,
    getadminHome,
    addproductPage,
    addProduct
}