const express = require('express')
const router = express.Router();

const fileUpload = require('express-fileupload')
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dbbszpcem",
    api_key: "152421262498747",
    api_secret: "Ibn2ckCSppFAQpS5at5pW_cANiQ"
  });


const OfferPublish  = require("../models/Offer")

const convertToBase64 = require("../utils/convertToBase64")






router.post("/offer/publish" , fileUpload(), async (req, res) => {

    try {
        console.log(req.body);
console.log(req.files);
      const {title , description , price , condition, city, brand ,size, color} = req.body;

       const productPicture = req.files.picture; 

       const finalPublish = await cloudinary.uploader.upload(convertToBase64(productPicture));

       const newOfferPublish = new OfferPublish({
        product_name: title,
        product_description: description,
        product_price: Number(price),
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        product_image: finalPublish,
       
        owner: req.user,

    });

    await newOfferPublish.save();
    res.json(newOfferPublish);
    console.log(newOfferPublish);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/offers", async (req, res) => {

    try {
        
        const { title, priceMin, priceMax, sort, page } = req.query;

        const filterPage = {}

        if (title) {
            filterPage.product_name = new RegExp(title, "i");
          }


          if (priceMin) {
            
            filterPage.product_price = { $gte: Number(priceMin) };
          }

          if (priceMax) {
            
            if (filterPage.product_price) {
           
              filterPage.product_price.$lte = Number(priceMax);
            } else {

                filter.product_price = { $lte: Number(priceMax) };
            }
          }
      
          const sortFilter = {};

          if (sort === "price-desc") {
            sortFilter.product_price = -1;
          } else if (sort === "price-asc") {
            sortFilter.product_price = 1;
          }
      
          const limit = 6;

          let pageRequired = 1;
          if (page) {
            pageRequired = page;
          }
      
          const skipPage = (pageRequired - 1) * limit;
          console.log(skipPage);
      
          console.log(filterPage);
          const offersFiltered = await OfferPublish.find(filterPage)
            .sort(sortFilter)
            .skip(skipPage)
            .limit(limit)
            .populate("owner", "account");
      
          const count = await OfferPublish.countDocuments(filterPage);
      
          res.json({ count: count, offers: offersFiltered });

    } catch (error) {
        
    }
})





module.exports = router;


