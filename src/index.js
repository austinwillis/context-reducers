import React, { Component, createContext } from 'react';

export default function createDispatchContext(initialState) {
  const { Consumer, Provider } = createContext({
    store: initialState,
    dispatch: () => {}
  });

  const ContextConsumer = Consumer;
  const ContextContainer = createContextContainer(initialState, Provider);

  return { ContextConsumer, ContextContainer };
}

export function createContextContainer(initialState, Provider) {
  return class ContextContainer extends Component {
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