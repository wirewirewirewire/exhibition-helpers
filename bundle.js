'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var toolkit = require('@reduxjs/toolkit');
var effects = require('redux-saga/effects');
var react = require('react');
var reactRedux = require('react-redux');
var Color = require('color');
var Axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Color__default = /*#__PURE__*/_interopDefaultLegacy(Color);
var Axios__default = /*#__PURE__*/_interopDefaultLegacy(Axios);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var _marked = /*#__PURE__*/regeneratorRuntime.mark(dataSaga),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(workerSaga);

var initialState = {
  data: undefined,
  responses: [],
  fetchinsg: false,
  error: null
};
var data = toolkit.createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    fetch: function fetch(state) {
      state.loading = true;
      state.error = false;
    },
    fetchSuccess: function fetchSuccess(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchFailure: function fetchFailure(state, action) {
      state.error = action.payload; //state.data = undefined;

      state.loading = false;
    }
  }
});
var getData = function getData(state) {
  return state.data.data;
};
var getDeviceData = function getDeviceData(state) {
  var _state$data, _state$data$data, _state$data$data$devi;

  return (_state$data = state.data) === null || _state$data === void 0 ? void 0 : (_state$data$data = _state$data.data) === null || _state$data$data === void 0 ? void 0 : (_state$data$data$devi = _state$data$data.deviceKind) === null || _state$data$data$devi === void 0 ? void 0 : _state$data$data$devi[0];
};
var getDetailById = function getDetailById(state, id) {
  var _state$data2, _state$data2$data, _state$data2$data$dev;

  return (_state$data2 = state.data) === null || _state$data2 === void 0 ? void 0 : (_state$data2$data = _state$data2.data) === null || _state$data2$data === void 0 ? void 0 : (_state$data2$data$dev = _state$data2$data.deviceKind) === null || _state$data2$data$dev === void 0 ? void 0 : _state$data2$data$dev[0].bewegung.find(function (e) {
    return e.id == id;
  });
};
var getQuestionsArray = function getQuestionsArray(state, filter) {
  return Object.entries(state.data.questions).map(function (e) {
    return _objectSpread2({
      id: e[0]
    }, e[1]);
  });
};
function dataSaga() {
  return regeneratorRuntime.wrap(function dataSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return effects.takeEvery(data.actions.fetch, workerSaga);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function fetchSaga(_ref) {
  var _window$balenaEnv;

  var search = _ref.search;
  return Axios__default['default']({
    method: "GET",
    url: "".concat((_window$balenaEnv = window.balenaEnv) !== null && _window$balenaEnv !== void 0 && _window$balenaEnv.DATA_URL ? window.balenaEnv.DATA_URL : process.env.REACT_APP_DATA_URL)
  });
}

function workerSaga(_ref2) {
  var payload, response;
  return regeneratorRuntime.wrap(function workerSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          payload = _ref2.payload;
          _context2.prev = 1;
          _context2.next = 4;
          return effects.call(fetchSaga, {
            search: payload
          });

        case 4:
          response = _context2.sent;
          _context2.next = 7;
          return effects.put(data.actions.fetchSuccess(response.data));

        case 7:
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          _context2.next = 13;
          return effects.put(data.actions.fetchFailure(_context2.t0));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, null, [[1, 9]]);
}
function DataLoader(props) {
  var dispatch = reactRedux.useDispatch();
  react.useEffect(function () {
    dispatch(data.actions.fetch());
    var interval = setInterval(function () {
      dispatch(data.actions.fetch());
    }, 1000 * 60 * 0.5);
    return function () {
      return clearInterval(interval);
    };
  }, []);
  var dataContent = reactRedux.useSelector(getData);
  var deviceData = reactRedux.useSelector(getDeviceData);
  react.useEffect(function () {
    var _deviceData$json;

    if (deviceData !== null && deviceData !== void 0 && (_deviceData$json = deviceData.json) !== null && _deviceData$json !== void 0 && _deviceData$json.color) {
      var _deviceData$json2;

      document.getElementById("root").style.setProperty("--interactive-01", deviceData.json.color);
      document.getElementById("root").style.setProperty("--text-01", (_deviceData$json2 = deviceData.json) !== null && _deviceData$json2 !== void 0 && _deviceData$json2.textColor ? deviceData.json.textColor : "#fff"
      /*deviceData.color*/
      );
      document.getElementById("root").style.setProperty("--interactive-02", Color__default['default'](deviceData.color).darken(0.1));
    }
  }, [dataContent]);
  if (deviceData) return props.children;
  return null;
}

exports.DataLoader = DataLoader;
exports.data = data;
exports.dataSaga = dataSaga;
exports.getData = getData;
exports.getDetailById = getDetailById;
exports.getDeviceData = getDeviceData;
exports.getQuestionsArray = getQuestionsArray;
