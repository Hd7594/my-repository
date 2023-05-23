const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();

const User = require('../models/User')

router.post("/user/inscription" , async (req, res) => {

    try{

        const { username, email, password, newsletter } = req.body;

        if (
            !username ||
            !email ||
            !password ||
            //   (newsletter !== true && newsletter !== false)
            typeof newsletter !== "boolean"
          ) {
            return res.status(400).json({ message: "Missing parameters" });
          }

          const userWithEmailReceived = await User.findOne({ email: email });

const token = uid2(64);
    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);


    if (userWithEmailReceived !== null) {
        return res.status(409).json({ message: "This email is already used" });
      }

    const newUser = new User({
        email: email,
        account: {
          username: username,
        },
        newsletter: newsletter,
        token: token,
        salt: salt,
        hash: hash,
      });
      console.log(newUser);
      await newUser.save();
      res.json({
        _id: newUser._id,
        token: newUser.token,
        account: newUser.account,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });