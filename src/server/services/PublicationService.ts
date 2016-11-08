import * as q from 'q';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Publication, IPublication } from '../models/publication';

export interface IPublicationService {

}

export class PublicationService {
    
    GetByFirstChar(firstChar: string): Promise<IPublication[]> {
        return Publication.find({_type: 'publication', FirstChar: firstChar});
    }

    GetBySearch(searchTerm: string): Promise<IPublication[]> {
        return Publication.find({_type: 'publication', $text: {$search: searchTerm}}).sort([['Title', 'ascending'], ['Series', 'ascending']]);
    }

    GetOwnedPercentage(): Promise<number> {
        let d = q.defer();
        var queries = new Array<Promise<number>>();

        let total = Publication.find({_type: 'publication'}).count();
        let owned = Publication.find({_type: 'publication', Owned: true}).count();
        queries.push(total);
        queries.push(owned);

        q.allSettled(queries)
            .then((results: q.PromiseState<number>[]) => {
                let totalVal = results[0].value;
                let ownedVal = results[1].value; 
                d.resolve(((ownedVal / totalVal) * 100).toFixed(2));
            })
            .catch((reason: string) => d.reject(reason));

        return d.promise;
    }

    Update(publication: IPublication): Promise<IPublication> {
        return Publication.findByIdAndUpdate(publication._id, publication);
    }

    Delete(pubId: string) {
        return Publication.findByIdAndRemove(pubId);
    }

}