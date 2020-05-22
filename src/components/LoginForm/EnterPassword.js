import React from 'react'
import FormInput from './FormInput'
import FormBody from './FormBody'
import { Linking } from 'react-native'
import styled from 'styled-components'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../typography'
import { URLS } from '../../constants'

const Button = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })``

const ForgotPasswordText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_GREY,
})`
  margin-bottom: 20px;
`

const EnterPaswword = ({
  password,
  passwordError,
  onChangePassword,
  onSubmit,
  passwordLabel,
  showPasswordReset,
}) => (
  <FormBody>
    <FormInput
      onChangeText={onChangePassword}
      secureTextEntry
      value={password}
      selectTextOnFocus
      onSubmitEditing={onSubmit}
      placeholderText="Your Password"
      error={passwordError}
      labelText={passwordLabel}
    />
    {showPasswordReset && (
      <Button onPress={() => Linking.openURL(URLS.PASSWORD_RESET)}>
        <ForgotPasswordText>Forgot your password?</ForgotPasswordText>
      </Button>
    )}
  </FormBody>
)

export default EnterPaswword
