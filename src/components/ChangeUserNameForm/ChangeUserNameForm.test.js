import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ChangeUserNameForm } from './ChangeUserNameForm';

test('Basic render snapshot test', () => {
  const component = shallow(<ChangeUserNameForm
    fields={{ userName: 'userName' }}
    handleSubmit={() => {}}
    errorMessage={'errormessage'}
  />);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

