# React Context Reducers

This library wraps the React context API to provide global state management. It adapts the idea of reducers from the flux architecture but forgoes the use of actions. Here the actions are the reducers and a dispatch function is provided through React context that allows state changes to be made.

## Install

Add the library with yarn
```
yarn add context-reducers
```

Or install with npm
```
npm i -D context-reducers
```

## Create Store

To use `context-reducers`, you will need to first create a store. This is done by providing an inital state to the `createDispatchContext` function.

```
import createDispatchContext from 'context-reducers'

const initialState = {
    open: false,
    text: '',
    data: [],
    loadingData: false
}

export default createDispatchContext(initialState);
```

The result of `createFluxContext` is a store object that has a Provider and Consumer that utilize React context.

## Provide Store

Import the store you created and use the `ContextContainer` to provide the store to child components.

```
import Store from './createStore';

export default class StoreProvider extends Component {
  render() {
    return (
        <Store.ContextContainer>
            {this.props.children}
        </Store.ContextContainer>
    );
  }
}
```

## Using the Store

The `ContextConsumer` property of the store is used to access store values.

```
import Store from './createStore';

export default class Child extends Component {
    render() {
      return <Store.ContextConsumer>
        {({ store: { text } }) => <p>{text}</p>}
      </Store.ContextConsumer>
    }
}
```

## Actions

Actions are used to update the store. Each action is a function that receives state, payload and dispatch as arguments and returns a new state.

A simple action that updates the state look like this.

```
export function open({ open, ...res }, payload, dispatch) {
    return {
        ...res,
        open: !open
    }
}
```

## Updating the Store

Actions are used to update the store by importing them and passing them to the store's `dispatch` property.

```
import Store from './createStore';
import { open } from './actions';

export default class Child extends Component {
    render() {
        return <Store.ContextConsumer>
          {({ dispatch }) => <button onClick={dispatch(open)}>Toggle</button>}
        </Store.ContextConsumer>
    }
}
```

## Async Updates

Actions that need to perform asyncronous updates can be done using async functions.

```
export async function getData(state) {
    const d = await fetchData();
    return currentState => ({
        ...currentState,
        data: d,
        loadingData: false
    });
}
```

The return value of an asynchronous funtion should be a function that receives the current state as an argument. This is necessary to make sure that once a promise resolves, the state updates can be made without wiping out interim updates.

## Dispatch Multiple Actions

When you need to trigger multiple actions, it can be done using the dispatch argument passed into an action.

```
function setLoading(state) {
    return ({
        ...state, loadingData: true
    })
}

export async function getData(state, _, dispatch) {
    dispatch(setLoading)
    const d = await fetchData();
    return currentState => ({
        ...currentState,
        data: d,
        loadingData: false
    });
}
```

You can also trigger multiple actions by calling dispatch with multiple arguments.

```
import Store from './createStore';
import { setLoading, getData } from './actions';

export default class Child extends Component {
    render() {
        return <Store.ContextConsumer>
          {({ dispatch }) => <button onClick={dispatch(setLoading, getData)}>Toggle</button>}
        </Store.ContextConsumer>
    }
}
```