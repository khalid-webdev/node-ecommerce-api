const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const axios = require('axios');
const {paypal,getAccessToken}=require("../config/paypal");

//creating order for
router.post("/paypal/create-order",authMiddleware,async(req,res)=>{
  const accessToken =await getAccessToken()
  await axios.post(`${paypal.baseUrl}/v2/checkout/orders`,{
    intent:"CAPTURE",
    purchase_units:[
      {
        description:"Shopping Cart order",
        amount:{
          currency_code:"USD",
          value:10
        }
      }
    ],
    application_context:{
      return_url:"",
      cancel_url:""
    }
  },{
    headers:{
      "Content-Type":"Application/json",
      Authorization:`Bearer ${accessToken}`
    }
  })
  res.json({
    approvalUrl:response.data.links.find((link)=>link.rel==="approve").href
  })
});




module.exports = router;
