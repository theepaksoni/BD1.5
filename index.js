const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3010;
app.use(cors());

app.use(express.static('static'));

//Server side values
let taxRate = 5; //5%
let discountPercentage = 10; //10%
let loyaltyRate = 2; // 2 points per 1$ spend

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let totalPrice = newItemPrice + cartTotal;
  res.send(totalPrice.toString());
});

function membershipDiscount(cartTotal, isMember) {
  if (isMember) {
    let dis = (cartTotal * discountPercentage) / 100;
    return cartTotal - dis;
  } else {
    return cartTotal;
  }
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  res.send(membershipDiscount(cartTotal, isMember).toString());
});

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let taxPrice = (cartTotal * taxRate) / 100;
  res.send(taxPrice.toString());
});

function deliveryEstimate(distance, shippingMethod) {
  if (shippingMethod === 'express') {
    return distance / 100;
  } else if (shippingMethod === 'standard') {
    return distance / 50;
  } else {
    return 1;
  }
}
app.get('/estimate-delivery', (req, res) => {
  let distance = parseFloat(req.query.distance);
  let shippingMethod = req.query.shippingMethod;
  res.send(deliveryEstimate(distance, shippingMethod).toString());
});

app.get('/shipping-cost', (req, res) => {
  let distance = parseFloat(req.query.distance);
  let weight = parseFloat(req.query.weight);
  let cost = distance * weight * 0.1;
  res.send(cost.toString());
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  let loyaltyPoints = purchaseAmount * loyaltyRate;
  res.send(loyaltyPoints.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
