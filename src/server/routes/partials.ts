import * as express from 'express';

class Partials {

    public Get(req: express.Request, res: express.Response) {
        var name = req.params.name;
        res.render('partials/' + name);
    }

}

let router = express.Router();
let partials = new Partials();

router.get('/:name', partials.Get);

module.exports = router;