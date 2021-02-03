# exhibition-helpers (work in progress)

Multiple small helpers to use inside a react exhibiton project

npm: https://www.npmjs.com/package/@wirewire/exhibition-helpers

### How to use

- run `npm install @wirewire/exhibition-helpers --save-dev`

### Helpers

#### Dataloader

CRUD actions to handle data

```
import { combineReducers } from "redux";
import { data, dataSaga } from "@wirewire/exhibition-helpers";

import { all, fork } from "redux-saga/effects";

const rootReducer = () =>
  combineReducers({
    data: data.reducer,
    ...otherReducers
  });

export default rootReducer;

export function* rootSaga() {
  yield all([fork(dataSaga)]);
}
```

### Introduction
[managing digital devices for exhibitions](https://wirewire.de/article/managing-digital-devices-for-exhibitions)
