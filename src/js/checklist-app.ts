import { module } from 'angular';
import { PubService } from './publications/publications-service';
import { PublicationsController } from './publications/publications-controller';
import { ParseSeriesController } from './publications/parse-series-controller';
import { SeriesService } from './series/series-service';
require('angular-bootstrap-npm');

export let app = module('checklist', [
    'ui.bootstrap'
]);

app.service('pubService', PubService);
app.service('seriesService', SeriesService);

app.controller('checklistCtrl', PublicationsController);
app.controller('parseSeriesCtrl', ParseSeriesController);