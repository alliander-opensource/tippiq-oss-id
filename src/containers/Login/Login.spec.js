import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { Login } from '../../containers';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Login container', () => {
  it('should render a login container', () => {
    const store = configureStore({}, browserHistory, false, api);
    const location = { query: {} };
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <Login location={location} />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
