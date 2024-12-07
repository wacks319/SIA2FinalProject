import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './ShoppingList.css';
import { Button } from '@mui/material';

import Navbar from './Navbar'; // Assuming Navbar is correctly implemented

import { useNavigate } from 'react-router-dom';
 
const items = [
  { url: "http://192.168.10.12/YACAPIN", img: "WNE.png", caption: "Watch and Earn" },
  { url: "http://192.168.10.14", img: "UnionBank.png", caption: "Union Bank" },
  { url: "http://192.168.10.18:3000", img: "CafeReyes.png", caption: "Cafe Reyes" },
  { url: "http://192.168.10.19", img: "kfc.png", caption: "KFC" },
  { url: "http://192.168.10.17/login", img: "CLickers.png", caption: "Clickers" },
  { url: "http://192.168.10.27", img: "WATSONS.png", caption: "Watsons" },
  { url: "http://192.168.10.36", img: "MedPoint.png", caption: "MedPoint" },
  { url: "http://192.168.10.21", img: "OHMART.jpg", caption: "OHMart" },
  { url: "http://192.168.10.22", img: "tx.png", caption: "TX" },
  { url: "http://192.168.10.22", img: "INGCO.png", caption: "INGCO" },
  { url: "http://192.168.10.26", img: "Shoepatoes.jpg", caption: "ShoePatoes" },
  { url: "http://localhost", img: "NationalBookStore.jpg", caption: "National BookStore" },
  { url: "http://192.168.10.25", img: "SavemoreLogo.png", caption: "SaveMore" },
  { url: "http://192.168.10.37", img: "ParaPo.png", caption: "Para Po" },
  { url: "http://192.168.10.23/moto", img: "Motortrade.jpg", caption: "Motortrade" },
  { url: "http://192.168.10.38", img: "Toyota.png", caption: "Toyota" },
  { url: "http://192.168.10.29", img: "Order.png", caption: "Order 29" },
  { url: "http://192.168.10.30", img: "Order.png", caption: "Order 30" },
  { url: "http://192.168.10.31", img: "Order.png", caption: "Order 31" },
  { url: "http://192.168.10.32", img: "Order.png", caption: "Order 32" },
  { url: "http://192.168.10.33", img: "Order.png", caption: "Order 33" },
  { url: "http://192.168.10.34", img: "Order.png", caption: "Order 34" },
  { url: "http://192.168.10.35", img: "Order.png", caption: "Order 35" },
  { url: "http://192.168.10.36", img: "Order.png", caption: "Order 36" },
  { url: "http://192.168.10.37", img: "Order.png", caption: "Order 37" },
  { url: "http://192.168.10.38", img: "Order.png", caption: "Order 38" },
  { url: "http://192.168.10.39", img: "Order.png", caption: "Order 39" },
  { url: "http://192.168.10.40", img: "Order.png", caption: "Order 40" },
];
 
 
 
 
function ShoppingList() {
  const navigate = useNavigate();
 

  return (
   
    <div className="container">
          <Navbar />

<Grid container spacing={2} className="grid-container">
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card className="card">
            <CardActionArea component={Link} to={item.url} className="card-action-area">
              <CardMedia
                component="img"
                alt={item.caption}
                className="card-media"
                image={item.img}
              />
              <CardContent className="card-content">
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.caption}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
 
    </div>
   
  );
}
 
export default ShoppingList;
 