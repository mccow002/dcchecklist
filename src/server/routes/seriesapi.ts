import * as express from 'express';
import * as mongoose from 'mongoose';
import { Series, ISeries } from '../models/series';
import { Config } from '../../config'

class SeriesApi {

    constructor() {
        //mongoose.connect(Config.DbConnection);
    }

    public CreateSeries(req: express.Request, res: express.Response) {
        var series = req.body;
        console.log(series);
    }

}

let seriesApi = new SeriesApi();
let router = express.Router();
router.post('/create', seriesApi.CreateSeries);

module.exports = router;