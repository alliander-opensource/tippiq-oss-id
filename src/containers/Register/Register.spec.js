import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { Register } from '../../containers';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Register container', () => {
  it('should render a register container', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <Register />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
