import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { SetupPasswordAndNameForm } from './SetupPasswordAndNameForm';

test('Basic render snapshot test', () => {
  const component = shallow(<SetupPasswordAndNameForm
    fields={{ password: 'password' }}
    showUserName
    onSubmit={() => {}}
    errorMessage={'errormessage'}
  />);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

