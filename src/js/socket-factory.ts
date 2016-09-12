export module Sockets {
    export function Factory($rootScope: ng.IRootScopeService) {
        let io = <SocketIO.Socket>(<any>window).io.connect();
        return {
            on(eventName: string, callback: (data: any) => void) {
                io.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(io, args);
                    });
                });
            },
            emit(eventName: string, data: any, callback: () => void) {
                io.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(io, args);
                        }
                    });
                });
            },
            unsubscribe(eventName: string) {
                io.removeAllListeners(eventName);
            }
        }
    }

    Factory.$inject = ['$rootScope'];
}

export module Sockets {
    export function PubSub(socket: any) {
        let container = new Array<string>();
        return {
            subscribe(name: string, callback: (args: any) => void) {
                console.log('Subscribing to ' + name);
                socket.on(name, callback);
                container.push(name);
            },
            unsubAll() {
                for(var i=0; i<container.length; i++){
                    console.log('Unsubscribing from ' + container[i]);
                    socket.unsubscribe(container[i]);
                }

                // socket.unsubscribe('pageLoaded');
                // socket.unsubscribe('pagesLoaded');
                container = new Array<string>();
            }
        }
    }

    PubSub.$inject = ['socket'];
}