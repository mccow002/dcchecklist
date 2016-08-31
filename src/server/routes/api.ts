import * as express from 'express';
import * as mongoose from 'mongoose';
import { Publication, IPublication } from '../models/comic';

let Comic = require('../models/comic');
let router = express.Router();

class PublicationsApi {

    constructor() {
        const url = 'mongodb://localhost:27017/comics';
        mongoose.connect(url);
    }

    public GetAll(req: express.Request, res: express.Response) {
        Publication.find({FirstChar: req.params.index}, (err: mongoose.Error, pubs: Array<IPublication>) => {
            res.json({pubs: pubs});
        });
    }

    public Update(req: express.Request, res: express.Response) {
        let pub = req.body;
        Publication.findByIdAndUpdate(pub._id, pub, (err: mongoose.Error, update: IPublication) => {
            if(err) throw err;
            res.json(update);
        });
    }

    public Delete(req: express.Request, res: express.Response) {
        Publication.findByIdAndRemove(req.params.id, (err) => {
            if(err) throw err;
            res.json(200);
        });
    }
}

let pubApi = new PublicationsApi();

router.get('/getall/:index', pubApi.GetAll);
router.put('/', pubApi.Update);
router.delete('/:id', pubApi.Delete);

// router.get('/search/:search', function(req, res){
//     Comic.find({$text: {$search: req.params.search}})
//         .exec(function(err, results){
//             res.json({comics: results}); 
//         })
// });

// router.put('/', function(req, res){
//     console.log(req.body);

//     var comic = req.body;
//     Comic.findByIdAndUpdate(comic._id, comic, function(err, update){
//         if(err) throw err;

//         res.json(update);
//     });
// });

// router.delete('/:id', function(req, res){
//     console.log(req.params.id);

//     Comic.findByIdAndRemove(req.params.id, function(err){
//         if(err) throw err;
//         res.json(200);
//     })
// })

module.exports = router;