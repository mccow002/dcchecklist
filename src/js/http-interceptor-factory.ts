export module Http {
    export function Interceptor($q: ng.IQService, $rootScope: ng.IRootScopeService) {
        let loadingCount = 0;

        return {
            request: (config: any) => {
                if(config.url.endsWith('.html')){
                    return config || $q.when(config);
                }                

                if(++loadingCount === 1) {
                    $rootScope.$broadcast('loading:progress');
                }
                return config || $q.when(config);
            },
            response: (response: any) => {
                if(response.config.url.endsWith('.html')){
                    return response || $q.when(response);
                }

                if(--loadingCount === 0) {
                    $rootScope.$broadcast('loading:finish');
                }
                return response || $q.when(response);
            },
            responseError: (response: any) => {
                if(--loadingCount === 0) {
                    $rootScope.$broadcast('loading:finish');
                }
                return $q.reject(response);
            }
        }
    }
}