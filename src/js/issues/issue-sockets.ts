export module Sockets {
    export function Reader(socket: any) {
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

    Reader.$inject = ['socket'];
}