var { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
var { Itin } = require('./models/itin');
const fs = require('fs');

module.exports = function(app) {
    app.get('/', (req, res) => {
        var html = fs.readFileSync('./server/index.html', 'utf8');
        res.send(html);
    });

    // Creates a new itin based on userId
    app.post('/itin/create', (req, res) => {
        console.log(req.body);

        var userId = req.body.userId;

        var itin = new Itin({
            userId,
        });

        itin.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send();
        });
    });

    // Adds to a specific itin based on _id
    app.patch('/itin/:id', (req, res) => {
        var id = req.params.id;
        var userId = req.body.data.userId;
        var place = req.body.data.place;
        console.log(place);

        if(!ObjectID.isValid(id)) {
            return res.status(404).send();
        };

        Itin.findByIdAndUpdate(id, {$push: {
            places: place
        }}, {new: true}).then((place) => {
            if(!place) {
                return res.status(404).send();
            };
            res.send({place});
        }, (e) => {
            res.status(400).send(e);
        });
    });

    // Deletes an item from a specific itin based on _id
    app.patch('/itin/item/:id/', (req, res) => {
        var id = req.params.id;
        var place = req.body;

        if(!ObjectID.isValid(id)) {
            return res.status(404).send();
        };

        Itin.findByIdAndUpdate(id, {$pull: {
            places: place
        }}).then((place) => {
            if(!place) {
                return res.status(404).send();
            };
            res.send({place});
        }, (e) => {
            res.status(400).send(e);
        });
    });

    // Edits the title of an itinerary draft based on _id
    app.patch('/itin/title/:id', (req, res) => {
        var id = req.params.id;
        var name = req.body;

        if(!ObjectID.isValid(id)) {
            return res.status(404).send();
        };

        Itin.findByIdAndUpdate(id, {$set: 
            name
        }).then((itin) => {
            if(!itin) {
                return res.status(404).send();
            };
            res.send({itin});
        }, (e) => {
            res.status(400).send();
        });
    });

    // Changes the inProgess of a draft to false, publishing the itinerary
    app.patch('/itin/publish/:id', (req, res) => {
        var id = req.params.id;

        if(!ObjectID.isValid(id)) {
            return res.status(400).send();
        };

        Itin.findByIdAndUpdate(id, {$set: {
            inProgress: false
        }}).then((itin) => {
            if(!itin) {
                return res.status(404).send();
            };
            res.send({itin});
        }, (e) => {
            res.status(400).send();
        });
    });

    // Gets all the itins in db
    app.get('/itin/all', (req, res) => {
        Itin.find({'inProgress': false}).then((itins) => {
            res.send({itins});
        }, (e) => {
            //res.status(400).send();
            res.send(e);
        });
    });

    // Get specific itin based on _id
    app.get('/itin/:id', (req, res) => {
        var id = req.params.id;

        if(!ObjectID.isValid(id)) {
            return res.status(404).send();
        };

        Itin.findById(id).then((itin) => {
            res.send({itin});
        }, (e) => {
            res.send(400).send()
        });
    });

    // Get all of user's finished itins
    app.post('/itin/mine/done', (req, res) => {
        var userId = req.body.userId;

        Itin.find({userId, inProgress: false}).then((itins) => {
            res.send({itins});
        }, (e) => {
            res.status(404).send();
        });
    });

    // Get all of user's draft itins
    app.post('/itin/mine/drafts', (req, res) => {
        var userId = req.body.userId;

        Itin.find({userId, inProgress: true}).then((itins) => {
            res.send({itins});
        }, (e) => {
            res.status(404).send();
        });
    });

    // Delete a specific itin
    app.delete('/itin/:id', (req, res) => {
        var id = req.params.id;

        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        };

        Itin.findByIdAndRemove(id).then((itin) => {
            if(!itin){
                return res.status(404).send();
            }
            res.status(200).send({itin});
        }).catch((e) => {
            return res.status(400).send();
        });
    });
}