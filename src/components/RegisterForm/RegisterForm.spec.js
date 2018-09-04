import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { RegisterForm } from '../../components';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Register form component', () => {
  it('should render a register form', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <RegisterForm onSubmit={() => {}} loginUrl="/" />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
