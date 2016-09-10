// export class SocketFactory {

//     static $inject = ['$rootScope'];

//     io: any;

//     constructor(private $rootScope: ng.IRootScopeService) {
//         this.io = (<any>window).io.connect();
//     }

//     on(eventName: string, callback: (data: any) => void) {
//         this.io.on(eventName, function () {  
//             var args = arguments;
//             this.$rootScope.$apply(function () {
//             callback.apply(this.io, args);
//             });
//         });
//     }

//     emit(eventName: string, data: any, callback: () => void) {
//         this.io.emit(eventName, data, function () {
//             var args = arguments;
//             this.$rootScope.$apply(function () {
//             if (callback) {
//                 callback.apply(this.io, args);
//             }
//             });
//         });
//     }
// }

export module Socket {
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