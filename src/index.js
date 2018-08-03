import React, { Component, createContext } from 'react';

export default function createFluxContext(initialState) {
  const { Consumer, Provider } = createContext({
    store: initialState,
    dispatch: () => {}
  });

  const FluxConsumer = Consumer;
  const FluxContainer = createFluxContainer(initialState, Provider);

  return { FluxConsumer, FluxContainer };
}

export function createFluxContainer(initialState, Provider) {
  return class FluxContainer extends Component {
    state = {
      store: initialState,
      dispatch: (...actions) => async (payload) => {
        actions.forEach(
          async action => {
            console.log({action: action.name || action, payload});
            if (payload && payload.persist && typeof(payload.persist) === 'function') {
              payload.persist();
            }
            const newState = action(this.state.store, payload, this.state.dispatch);
            if (newState.then) {
              const resolvedStateFn = await newState;
              this.setState(s => ({ ...s, store: resolvedStateFn(s.store) }))
            } else {
              this.setState(s => ({ ...s, store: newState }))              
            }
          }
        )
      }
    }

    render() {
      return (
          <Provider value={this.state}>
            {this.props.children}
          </Provider>
      );
    }
  }
}