const { Router } = require('express')

const User = require('../models/user');
const router = new Router();


//sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    // console.log(user, "user")
    try {
        await user.save()
        const token = await user.generateAuthToken()
        // console.log(token, "sdfjhaslj")
        res.status(201).send({user, token});
    } catch(e) {
        console.log(e, "error")
        res.status(400).send(e)
    }
})

//sign in
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.gmail_id);
        const token = await user.generateAuthToken()
        res.send({user, token});
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router;