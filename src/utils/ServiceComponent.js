import * as React from 'react';

export class ServiceComponent {

    initialState = {};

    constructor(initialState) {
        this.initialState = initialState;
    }

    setState(state) {
        this._provider.setState(state);
    }

    getState() {
        return { ...this._provider.state };
    }

    _provider = null;
}

export function createServiceContext(serviceComponent) {

    const { Consumer, Provider: ContextProvider } = React.createContext(serviceComponent.initialState);

    class Provider extends React.Component {

        constructor(props) {
            super(props);

            serviceComponent._provider = this;

            let actions = {};
            for(let k of Object.getOwnPropertyNames(serviceComponent)) {
                let f = serviceComponent[k];
                if(typeof f == 'function') {
                    actions[k] = f;
                }
            }

            this.state = { ...serviceComponent.initialState, ...actions };

            // console.log('Service component created ' + serviceComponent.constructor.name);
        }

        componentDidMount() {
            
        }

        render = () => {
            
            // console.log('Rendering provider ' + serviceComponent.constructor.name);

            
            return (
            <ContextProvider value={this.state}>{ this.props.children }</ContextProvider>
        )}
    }

    return { Consumer, Provider };
}