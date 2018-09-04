import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { LoginForm } from '../../components';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Login form component', () => {
  it('should render a login form', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <LoginForm onSubmit={() => {}} registerUrl="/" resetPasswordUrl="/" />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
