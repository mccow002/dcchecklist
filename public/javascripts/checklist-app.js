'use strict';

var app = angular.module('checklist', [
    'ui.bootstrap'
]);

app.controller('checklistCtrl', 
    function ($scope, $uibModal, checklistData){
        $scope.comics = [];
        $scope.indexes = ['0-9'];
        $scope.index = 0;
        for(var i=65;i<91;++i) {
            $scope.indexes.push(String.fromCharCode(i));
        }

        $scope.load = function(){
            $scope.comics = [];
            checklistData.load($scope.indexes[$scope.index]).then(function(data){
                $scope.comics = data;
            });
        };

        $scope.load();

        $scope.loadSlice = function(index){
            $scope.index = index;
            $scope.load();
        }

        $scope.buildCvSearchUrl = function(comic){
            return "http://comicvine.gamespot.com/search/?q=" + comic.Title.replace(/ /g, '+');
        };

        $scope.buildDcSearchUrl = function(comic){
            return 'http://dc.wikia.com/wiki/Special:Search?fulltext=Search&search=' + comic.Title.replace(/ /g, '+');
        };

        $scope.search = function(){
            $scope.comics = [];

            if($scope.search.val === ''){
                $scope.load();
                return;
            }

            checklistData.search($scope.search.val)
                .then(function(data){
                    $scope.comics = data;
                });
        };

        $scope.flagAsOwned = function(r){
            if(r.Owned){
                return 'success';
            }
        };

        $scope.markAsOwned = function(comic){
            comic.Owned = !comic.Owned;
            checklistData.put(comic);
        };

        $scope.remove = function(comic){
            checklistData.remove(comic);
            var index = $scope.comics.indexOf(comic);
            $scope.comics.splice(index, 1);
        };

        $scope.parseSeries = function(comic){
            var modal = $uibModal.open({
                controller: 'parseSeriesCtrl',
                templateUrl: '/html/parseSeries.html',
                resolve: {
                    comic: function(){
                        return comic;
                    }
                }
            });
        };
});

app.controller('parseSeriesCtrl',
    function($scope, $uibModalInstance, comic){
        $scope.issuesText = comic.Issues;
        $scope.issues = {};

        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };

        var issues = comic.Issues;

        var range = function(){
            var regex = function(){return /#[0-9]+\-[0-9]+/g;}
            if(!regex().test(issues)){
                return {
                    success: false
                };
            }

            var r = regex().exec(issues);
            r = r[0].replace(/#/g, '');
            var parts = r.split('-');
            return {
                success: true,
                first: parts[0],
                last: parts[1]
            };
        };

        var single = function(){

        };

        var inNotes = function(){

        };

        var parsers = [range, single, inNotes];
        for(var i = 0; i < parsers.length; i++){
            var result = parsers[i]();

            if(!result.success){
                continue;
            }

            $scope.issues.first = result.first;
            $scope.issues.last = result.last;
            break;
        }
    });

app.filter('search', function($filter){
    return function(items, text){ 
        if (!text || text.length === 0)
            return items;
        
        // split search text on space
        var searchTerms = text.split(' ');
        
        // search for single terms.
        // this reduces the item list step by step
        searchTerms.forEach(function(term) {
            if (term && term.length)
            items = $filter('filter')(items, term);
        });

        return items;
    }
});

app.factory('checklistData', function($q, $http){
    return {
        load: function(index){
            var q = $q.defer();
            var req = $http.get('/api/getall/' + index);

            req.success(function(data){
                q.resolve(data.comics);
            });

            req.error(function(){
                q.reject();
            });

            return q.promise;
        },
        search: function(search){
            var q = $q.defer();
            var req = $http.get('/api/search/' + search);

            req.success(function(data){
                q.resolve(data.comics);
            });

            req.error(function(){
                q.reject();
            });

            return q.promise;
        },
        put: function(comic){
            var q = $q.defer();
            var req = $http.put('/api/', comic);

            req.success(function(){
                q.resolve();
            });

            req.error(function(){
                q.reject();
            });

            return q.promise;
        },
        remove: function(comic){
            var q = $q.defer();
            var req = $http.delete('/api/' + comic._id);

            req.success(function(){
                q.resolve();
            });

            req.error(function(){
                q.reject();
            });

            return q.promise;
        }
    };
});