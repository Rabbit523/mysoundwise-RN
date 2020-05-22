import React from 'react'
import FormInput from './FormInput'
import FormBody from './FormBody'

class EnterUserInfo extends React.Component {
  render() {
    const {
      firstName,
      lastName,
      credentialsError,
      onChangeFirstName,
      onChangeLastName,
      onSubmit,
    } = this.props
    return (
      <FormBody>
        <FormInput
          onChangeText={onChangeFirstName}
          value={firstName}
          onSubmitEditing={() => this.lastNameInput.focus()}
          returnKeyType="next"
          labelText="Your first name"
          placeholderText="First name"
        />
        <FormInput
          onChangeText={onChangeLastName}
          innerRef={ref => (this.lastNameInput = ref)}
          onSubmitEditing={onSubmit}
          value={lastName}
          labelText="Your last name"
          placeholderText="Last name"
          error={credentialsError}
        />
      </FormBody>
    )
  }
}
export default EnterUserInfo
