import * as express from 'express';

let router = express.Router();

/* GET home page. */
router.get('/', (req: express.Request, res: express.Response) => {
  res.render('index');
});

module.exports = router;
