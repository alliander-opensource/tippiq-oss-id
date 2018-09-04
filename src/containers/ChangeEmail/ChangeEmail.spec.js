import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { ChangeEmail } from '../../containers';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Change email container', () => {
  it('should render a change email container', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <ChangeEmail />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
