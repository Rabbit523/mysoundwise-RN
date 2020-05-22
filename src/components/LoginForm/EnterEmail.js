import React from 'react'
import FormInput from './FormInput'
import FormBody from './FormBody'

const EnterEmail = ({ onChangeEmail, email, onSubmit, emailError }) => (
  <FormBody>
    <FormInput
      onChangeText={onChangeEmail}
      value={email}
      onSubmitEditing={onSubmit}
      placeholderText="Your Email"
      error={emailError}
    />
  </FormBody>
)

export default EnterEmail
