const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

// const users = [{name: "Name"}]  // in a real application, the users would be stored in a DB 
const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req, res) => {
    try {
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(req.body.password, salt);  //appends the password hash at the end of the salt
        // console.log(salt);
        // console.log(hashedPassword);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);  // The second argument is the number of rounds to use when generating a salt
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user);
        res.status(201).send()  // 201 is used for successful POST request
    } catch {
        res.status(500).send();
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);  // The find() method returns the value of the first element in an array that pass a test (provided as a function).
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send()
    }
})

app.listen(9000);