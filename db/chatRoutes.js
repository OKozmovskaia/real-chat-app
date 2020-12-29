const  express  = require("express");
const  connectdb  = require("./dbconnection");
const  Chats  = require("./chatSchema");

const  router  =  express.Router();

router.route("/").get((req, res, next) =>  {
        res.setHeader("Content-Type", "application/json");
        res.statusCode  =  200;
        connectdb.then(db  =>  {
            Chats.find({}).then(chat  =>  {
            res.json(chat);
            console.log(chat);
        });
    });
});

module.exports  =  router;