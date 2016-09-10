import { SeriesService } from './series-service';
import { ISeries } from './series-model';

export class SeriesController {

    static $inject = ['seriesService'];

    Series: Array<ISeries>;

    constructor(private seriesService: SeriesService) {
        seriesService.GetAll()
            .then((series: ISeries[]) => {
                this.Series = series;
            })
    }

}