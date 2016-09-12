import { module } from 'angular';

import { PublicationsController } from './publications/publications-controller';
import { ParseSeriesController } from './series/parse-series-controller';
import { SeriesController } from './series/series-controller';
import { SeriesDetailsController, LinkSeriesController } from './series/series-details-controller';
import { IssueDetailsController, LinkIssueController } from './issues/issue-details-controller';
import { CollectionController, NewFolderController } from './collection/collection-controller';
import { RootController } from './root-controller';

import { SeriesService } from './series/series-service';
import { PubService } from './publications/publications-service';
import { IssueService } from './issues/issue-service';
import * as sockets from './socket-factory';

import * as directives from './directives/keypress';
import { AppConfig } from './app-config';

require('angular-bootstrap-npm');
require('angular-toastr');
require('angular-ui-router');
require('angular-cache');
require('angular-touch');
require('angular-tree-control');

export let app = module('checklist', [
    'ui.bootstrap',
    'toastr',
    'ui.router',
    'angular-cache',
    'ngTouch',
    'treeControl'
]);

app.service('pubService', PubService);
app.service('seriesService', SeriesService);
app.service('issueService', IssueService);

app.factory('socket', sockets.Sockets.Factory);
app.factory('pubsub', sockets.Sockets.PubSub);

app.directive('keypressEvents', directives.Directives.Keypress);

app.controller('rootCtrl', RootController);
app.controller('publicationsCtrl', PublicationsController);
app.controller('parseSeriesCtrl', ParseSeriesController);
app.controller('seriesDetailsCtrl', SeriesDetailsController);
app.controller('seriesCtrl', SeriesController);
app.controller('issueDetailsCtrl', IssueDetailsController);
app.controller('linkIssueCtrl', LinkIssueController);
app.controller('linkSeriesCtrl', LinkSeriesController);
app.controller('collectionCtrl', CollectionController);
app.controller('newFolderCtrl', NewFolderController);

app.constant('Months', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

app.config(AppConfig);