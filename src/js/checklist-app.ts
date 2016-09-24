import { module } from 'angular';

import { PublicationsController } from './publications/publications-controller';
import { ParseSeriesController } from './series/parse-series-controller';
import { SeriesController } from './series/series-controller';
import { SeriesDetailsController } from './series/series-details-controller';
import { IssueDetailsController } from './issues/issue-details-controller';
import { CollectionController, NewFolderController } from './collection/collection-controller';
import { RootController } from './root-controller';

import { SeriesService } from './series/series-service';
import { PubService } from './publications/publications-service';
import { IssueService } from './issues/issue-service';
import { ReaderPresenter } from './issues/reader-controller';
import { ParseSeriesPresenter } from './series/parse-series-controller';
import { CollectionService } from './collection/collection-service';

import * as sockets from './socket-factory';
import * as http from './http-interceptor-factory';

import * as keypress from './directives/keypress';
import * as resize from './directives/window-resize';
import * as spinner from './directives/spinner-on-load';
import * as remainingHeight from './directives/remaining-height';
import * as inputClear from './directives/clear-input';
import { AppConfig } from './app-config';

require('angular-bootstrap-npm');
require('angular-toastr');
require('angular-ui-router');
require('angular-cache');
require('angular-touch');
require('angular-tree-control');
require('angular-material');
require('angular-messages');
require('angular-local-storage');

export let app = module('checklist', [
    'ui.bootstrap',
    'toastr',
    'ui.router',
    'angular-cache',
    'ngTouch',
    'treeControl',
    'ngMaterial',
    'ngMessages',
    'LocalStorageModule'
]);

app.service('pubService', PubService);
app.service('seriesService', SeriesService);
app.service('issueService', IssueService);
app.service('readerPresenter', ReaderPresenter);
app.service('parseSeriesPresenter', ParseSeriesPresenter);
app.service('collectionService', CollectionService);

app.factory('socket', sockets.Sockets.Factory);
app.factory('pubsub', sockets.Sockets.PubSub);
app.factory('httpInterceptor', http.Http.Interceptor);

app.directive('keypressEvents', keypress.Directives.Keypress);
app.directive('windowResize', resize.Directives.WindowResize);
app.directive('spinnerOnLoad', spinner.Directives.SpinnerOnLoad);
app.directive('remainingHeight', remainingHeight.Directives.RemainingHeight);
app.directive('inputClear', inputClear.Directives.InputClear);

app.controller('rootCtrl', RootController);
app.controller('publicationsCtrl', PublicationsController);
app.controller('parseSeriesCtrl', ParseSeriesController);
app.controller('seriesDetailsCtrl', SeriesDetailsController);
app.controller('seriesCtrl', SeriesController);
app.controller('issueDetailsCtrl', IssueDetailsController);
app.controller('collectionCtrl', CollectionController);
app.controller('newFolderCtrl', NewFolderController);

app.constant('Months', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

app.config(AppConfig);