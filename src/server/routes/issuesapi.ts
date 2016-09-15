import * as express from 'express';
import * as mongoose from 'mongoose';
import { Issue, IIssue } from '../models/issue';
import { ComicReader } from '../services/comic-reader/ComicReader';
import * as colors from 'colors';

class IssuesApi {

    public GetIssue(req: express.Request, res: express.Response) {
        let issueId = req.params.id;
        Issue.findById(issueId, (err: mongoose.Error, result: IIssue) => {
            if(err) throw err;
            res.json(result);
        })
    }

    public LinkToFile(req: express.Request, res: express.Response) {
        let issue = req.body;
        Issue.findByIdAndUpdate(issue._id, issue,
            (err: mongoose.Error) =>{
                if(err) throw err;
                res.json(200);
            })
    }

    public LoadMetadata(req: express.Request, res: express.Response) {
        let issue = <IIssue>req.body;
        var reader = new ComicReader(issue.FilePath.toString());
        issue = reader.GetMetadataFromComicRack(issue);
        
        Issue.findByIdAndUpdate(issue._id, issue, 
            (err: mongoose.Error, result: IIssue) => {
                res.json(result);
            }); 
    }

}

let issuesApi = new IssuesApi();
let router = express.Router();
router.get('/:id', issuesApi.GetIssue);
router.put('/link', issuesApi.LinkToFile);
router.post('/metadata', issuesApi.LoadMetadata);

module.exports = router;