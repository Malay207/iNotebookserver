const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const jwt_secrete = "Malay@345@#$";
const router = express.Router();
//post request for user create
router.post("/createuser", [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() })
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(422).json({ success, errors: "User already exists" })
        }
        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hashSync(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user._id,
            }
        }
        const token = jwt.sign(data, jwt_secrete);
        success = true;
        res.json({ success, token });
    }
    catch (err) {

        res.status(500).send("Some error occured");
    }
}

)
//post request to user auth
router.post("/login", [
    body('email').isEmail(),
    body('password', 'password canot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, errors: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            success = false;
            return res.status(400).json({ success, errors: "Password incorrect" })
        }
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, jwt_secrete);
        success = true;
        res.json({ success, authtoken });
        // res.json({ success, authtoken });

    } catch (error) {

        res.status(500).send("Internal server error");
    }
}
)
//show login user data
router.post("/userdata", fetchuser,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user);
        } catch (error) {
            res.status(500).send("Internal server error");
        }

    }
)

module.exports = router;