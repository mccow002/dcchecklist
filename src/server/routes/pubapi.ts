import * as express from 'express';
import * as mongoose from 'mongoose';
import * as q from 'q';
import { Publication, IPublication } from '../models/publication';
import { PublicationService } from '../services/PublicationService';
import { Config } from '../config'

class PublicationsApi {

    constructor() {
        //mongoose.connect(Config.DbConnection);
    }

    public GetAll(req: express.Request, res: express.Response) {
        let pubService = new PublicationService();

        let getQ = pubService.GetByFirstChar(req.params.index);
        let countQ = pubService.GetOwnedPercentage();

        q.all([getQ, countQ])
            .then((results: [IPublication[], number]) => {
                res.json({
                    publications: results[0],
                    owned: results[1]    
                });
            })
            .catch((reason: string) => res.json(500, reason));
    }

    public Search(req: express.Request, res: express.Response) {
        let pubService = new PublicationService();

        let searchQ = pubService.GetBySearch(req.params.search)
        let countQ = pubService.GetOwnedPercentage();

        q.all([searchQ, countQ])
            .then((results: [IPublication[], number]) => {
                res.json({
                    publications: results[0],
                    owned: results[1] 
                }); 
            })
            .catch((reason: string) => res.json(500, reason));
    }

    public Update(req: express.Request, res: express.Response) {
        let pub = <IPublication>req.body;
        let pubService = new PublicationService();

        pubService.Update(pub)
            .then((update: IPublication) => {
                return pubService.GetOwnedPercentage();
            })
            .then((result: number) => res.json(result))
            .catch((reason: string) => res.json(500, reason));
    }

    public Delete(req: express.Request, res: express.Response) {
        let pubService = new PublicationService();

        pubService.Delete(req.params.id)
            .then(() => {
                return pubService.GetOwnedPercentage();
            })
            .then((result: number) => res.json(result))
            .catch((reason: string) => res.json(500, reason));
    }
}

let pubApi = new PublicationsApi();

let router = express.Router();
router.get('/getall/:index', pubApi.GetAll);
router.get('/search/:search', pubApi.Search);
router.put('/', pubApi.Update);
router.delete('/:id', pubApi.Delete);

module.exports = router;