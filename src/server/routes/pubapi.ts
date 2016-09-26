import * as express from 'express';
import * as mongoose from 'mongoose';
import { Publication, IPublication } from '../models/publication';
import { PublicationService } from '../services/PublicationService';
import { Config } from '../config'

class PublicationsApi {

    constructor() {
        //mongoose.connect(Config.DbConnection);
    }

    public GetAll(req: express.Request, res: express.Response) {
        let pubService = new PublicationService();

        pubService.GetByFirstChar(req.params.index)
            .then((pubs: Array<IPublication>) => {
                res.json(pubs);
            })
            .catch((reason: string) => res.json(500, reason));
    }

    public Search(req: express.Request, res: express.Response) {
        let pubService = new PublicationService();

        pubService.GetBySearch(req.params.search)
            .then((pubs: Array<IPublication>) => {
                res.json(pubs); 
            })
            .catch((reason: string) => res.json(500, reason));
    }

    public Update(req: express.Request, res: express.Response) {
        let pub = <IPublication>req.body;
        let pubService = new PublicationService();

        pubService.Update(pub)
            .then((update: IPublication) => {
                res.json(update);
            })
            .catch((reason: string) => res.json(500, reason));
    }

    public Delete(req: express.Request, res: express.Response) {
        let pubService = new PublicationService();

        pubService.Delete(req.params.id)
            .then(() => {
                res.json(200);
            })
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