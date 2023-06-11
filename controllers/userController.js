var con = require('../config/config')
const userModel = require('../Models/userModel')
let Razorpay = require('../Payments/Razorpay')
let productModel = require('../Models/productModel');
let cartModel = require('../Models/cartModel');

const getHomePage = async(req,res)=>{
    let product = await productModel.find();
     if(req.session.user){
        console.log(product);
         let user = req.session.user;
         let cart = await cartModel.findOne({userId:user._id})
         if(cart){
            console.log(cart,"from cart")
            let count = cart.products.length;
            console.log(count,'....')
            res.render('index',{user,product,count});
         }else{
            res.render('index',{user,product});
         }
         
         
     }else{
         res.render('index',{product});
     }
    
    }
    // let sql= "select * from products"
    // con.query(sql,(err,row) =>
    // {
    //     console.log(row)
    //     if(err)
    //     {
    //         console.log(err)
    //     }
    //     else
    //     {
    //         if(req.session.user)
    //         {
    //             let user = req.session.user;
    //             let id = user.id;
    //             console.log(user,"---------");
    //             let qryCart = "select count (*) as cartNumber from cart where userid = ?"
    //             con.query(qryCart,[id],(err,result)=>{
    //                 if(err)
    //                 {
    //                     console.log(err)
    //                 }
    //                 else{
    //                     console.log(result[0].cartNumber,"cart....")
    //                     let cart = result[0].cartNumber;
    //                     res.render('index',{user,row,cart});
    //                 }
    //             })
    //             // res.render('index',{user,row});
    //         }
    //         else{
    //             res.render('index',{row});
    //         }
    //     }
    // }) 


const getLoginPage = (req,res) => {
    res.render('users/login');
}
const getRegisterPage = (req,res) => {
    res.render('users/register');
}

const doRegister = async (req,res) => {
    console.log(req.body);
    let {password} = req.body;
    let {cpassword} = req.body;
    try {
       if(password==cpassword)
       {
       await userModel.create(req.body);
       console.log("user created");
       res.redirect('/login')
    }
    } 
    catch (error) {
       console.log(error); 
    }
}

const doLogin = async (req,res) =>
{
    let user = await userModel.find({username:req.body.username,password:req.body.password}) 
            if(user.length>0)
            {
                req.session.user = user[0];
                console.log(req.session.user,'from session data');
                console.log('login successfully'); 
                res.redirect('/');
            } 
            else
            {
                console.log("login error");
                res.redirect('/login');
            }
}

    // let {username} = req.body;
    // let {password} = req.body;
    // let quer = "select * from user where username = ? and password = ?";
    // con.query(quer,[username,password],(err,result) =>{
    //     if(err)
    //     {
    //         console.log(err)
    //     }
    //     else{
    //         console.log(result)
    
const getMyOrder = (req,res) =>
{
    let user = req.session.user;
    res.render('users/myOrder',{user});
}


const addtocart = async (req, res) => {
    let { user } = req.session;
    let { id } = req.params;
    try {
        let product = await productModel.findOne({ _id: id });
        product.id = id;
        console.log(product, "product details");
        let obj = {
            item: product,
            quantity: 1
        };
        let cart = await cartModel.findOne({ userId: user._id });
        if (cart) {
            let itemFound = false;
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].item._id == id) {
                    console.log("Item found");
                    await cartModel.findOneAndUpdate({
                        "products.item._id": product._id
                    },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }
                    )
                    itemFound = true;
                    break;
                }
            }
            if (!itemFound) {
                console.log("Item not found!");
                cart.products.push(obj);
            }
            await cart.save();
            res.redirect('/');
        } else {
            let cartObj = {
                userId: user._id,
                products: [obj]
            };
            console.log("cart", cartObj);
            await cartModel.create(cartObj);
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
    }
};



// const addtocart = async (req,res)=>
// {
//      let {user} = req.session;
//      let {id} = req.params;
//     try {
//         let product = await productModel.findOne({_id: id});
//         product.id = id;
//         console.log(product,"product details");
//         let obj ={
//             item:product,
//             quantity:1
//         }
//         let cart = await cartModel.findOne({userId:user._id})
//         if(cart){
//             console.log("add to cart");
//             console.log(cart,"cart item details");
//             cart.products.forEach(async obj => {
//                 if(obj.item._id ==id){
//                     console.log("Item found")
//                     var newqty = obj.quantity;
//                      newqty++;
//                      console.log(newqty);
//                     res.redirect('/')
//                 }
//                 else{
//                     console.log("not found!")
//                     await cartModel.findOneAndUpdate({ userId: user._id },{$push: {products: obj}})
//                     res.redirect('/')
//                 }  
//          });
//          }else{
//             let cartObj = {
//                 userId:user._id,
//                 products:[obj]
//             } 
//             console.log("cart",cartObj)
//             await cartModel.create(cartObj);
//             res.redirect('/')
//          }     
//         }
//         catch(error){
//             console.log(error)
//         }    
//     }




const cartPage = async (req, res) => {
    let { user } = req.session;
    try {
        let cart = await cartModel.findOne({ userId: user._id });
        console.log(cart);
        let products = cart.products;
        console.log("products", products);
        let totalItems = products.length;
        let totalPrice = 0;

        products.forEach((obj) => {
            totalPrice += obj.item.price * obj.quantity;
        });

        console.log(totalPrice, 'total price');

        let data = {
            totalItems,
            totalPrice
        };

        res.render('users/cartPage', { products, data });
    } catch (error) {
        console.log(error);
    }
};



// const cartPage = async (req,res) =>
// {
//     let {user} = req.session;
//     try {
//         let cart = await cartModel.findOne({userId:user._id});
//         console.log(cart);
//         let product = cart.products;
//         console.log("products",product);
//         let totalItems = product.length;
//         var total =0;
//         product.forEach((obj)=>{
//                 total = total +  obj.item.price * obj.quantity;
//         })
//         console.log(total,'total price');
//         let data = {
//             totalItems,
//             total
//         }
//         res.render('users/cartPage',{product,data});
//     } catch (error) {
//         console.log(error)
//     } 
// }

const buyNow = async (req,res) =>{
    let pid = req.params.id;
    try {
        let product = await productModel.find({_id:pid})
        console.log(product);
        product = product[0];
        let user = req.session.user;
        res.render('users/singleView',{product,user});
    } catch (error) 
    {
        console.log(error)
    }
    // let qry = "select * from products where id = ?";
    // con.query(qry,[pid],(err,result) =>
    // {
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else{
    //         let product =result[0];
    //         let user =req.session.user;
    //         res.render('users/singleView',{product,user});
    //     }
    // })
}

const checkOut = (req,res) =>{
    // let pid= req.params.id;
        let price = req.params.price * 100;
        console.log(price);
        var options = {
            amount: price,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          Razorpay.orders.create(options, function(err, order) {
            if(err)
            {
                console.log(err)
            }
            else{
            console.log(order);
            res.render('users/checkout',{order});
            }
    });
}

const payVerify = async(req) =>
{
    console.log(req.body);
    let data = req.body;
    var crypto = require('crypto');
    var order_id = data['response[razorpay_order_id]']
    var payment_id = data[ 'response[razorpay_payment_id]']
    const razorpay_signature = data[ 'response[razorpay_signature]']
    const key_secret = "53g2ihDVft0sBzrpnz3x0YAi";
    let hmac = crypto.createHmac('sha256', key_secret); 
    await hmac.update(order_id + "|" + payment_id);
    const generated_signature = hmac.digest('hex');
    if(razorpay_signature===generated_signature){
        console.log('verified')
    }
    else{
        console.log('failed')
    } 

}

const getlogout = (req,res) =>
{
    req.session.destroy();
    res.redirect('/');
}
module.exports = {
    getHomePage,
    getLoginPage,
    getRegisterPage,
    doRegister,
    doLogin,
    getMyOrder, 
    getlogout,
    addtocart,
    checkOut,
    payVerify,
    buyNow,
    cartPage
}