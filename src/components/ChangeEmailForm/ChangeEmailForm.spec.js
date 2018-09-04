import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { ChangeEmailForm } from '../../components';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Change email form component', () => {
  it('should render a change email form', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <ChangeEmailForm onSubmit={() => {}} />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
