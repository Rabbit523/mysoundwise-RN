import React from 'react'
import styled from 'styled-components'
import {
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
  Preloader,
} from '../index'
import EnterEmail from './EnterEmail'
import EnterPassword from './EnterPassword'
import EnterUserInfo from './EnterUserInfo'
import { emailPredicate, requiredPredicate } from '../../utils'
import { Keyboard, Platform } from 'react-native'
import { AUTH } from '../../constants'

const Button = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })``

const FormWrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
})`
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const Form = styled.View`
  padding-left: 35px;
  padding-right: 35px;
`
//  min-height: 374px;

const FormHead = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXXL,
  color: TEXT_COLOR.FONT_BLACK,
  weight: TEXT_WEIGHT.SEMI,
})`
    margin-bottom: 22px;
    margin-top: 35px;
`

const FormFooter = styled.KeyboardAvoidingView`
  flex-direction: row;
  justify-content: space-between;
  padding: 11px 15px 12px;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.color.divider};
`

const FormButtonText = StyledText.extend.attrs({
  size: TEXT_SIZE.XM,
  weight: ({ semi }) => semi && TEXT_WEIGHT.SEMI,
  color: ({ isOrange }) =>
    isOrange ? TEXT_COLOR.MAIN_ORANGE : TEXT_COLOR.FONT_BLACK,
})``

const FormButton = ({ isOrange, semi, children, ...rest }) => (
  <Button {...rest}>
    <FormButtonText semi={semi} isOrange={isOrange}>
      {children}
    </FormButtonText>
  </Button>
)

const STEPS = {
  ENTER_EMAIL: 0,
  ENTER_PASSWORD: 1,
  CREATE_PASSWORD: 2,
  ENTER_USER_INFO: 3,
}

const ERRORS = {
  PASSWORD: {
    INCORRECT: 'Password is not correct.',
    EMPTY: 'Password cannot be empty.',
  },
  EMAIL: {
    INVALID: 'Please enter a valid email address.',
    EMPTY: 'Email cannot be empty',
  },
  CREDENTIALS: {
    EMPTY: 'Please enter both your first and last names.',
  },
}

class LoginForm extends React.Component {
  state = {
    step: STEPS.ENTER_EMAIL,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    emailError: null,
    passwordError: null,
    credentialsError: null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isIdentificated !== this.props.isIdentificated) {
      if (this.props.isIdentificated === AUTH.PROCESS.YES) {
        this.setState({ step: STEPS.ENTER_PASSWORD })
      } else if (this.props.isIdentificated === AUTH.PROCESS.NO) {
        this.setState({ step: STEPS.CREATE_PASSWORD })
      } else {
        this.setState({ step: STEPS.ENTER_EMAIL })
      }
    }
    if (
      this.state.step === STEPS.ENTER_PASSWORD &&
      this.state.passwordError !== ERRORS.PASSWORD.INCORRECT &&
      this.props.isAuthentificated === AUTH.PROCESS.NO
    ) {
      this.setState({ passwordError: ERRORS.PASSWORD.INCORRECT })
    }
  }

  _onBackPress = () => {
    const {
      state: { step },
      props: { backToButtons, resetIdentification, resetAuthentification },
    } = this
    Keyboard.dismiss()
    if (step === STEPS.ENTER_EMAIL) {
      backToButtons()
    } else if (step === STEPS.ENTER_PASSWORD) {
      resetIdentification()
    } else if (step === STEPS.CREATE_PASSWORD) {
      this.setState({ step: STEPS.ENTER_EMAIL })
      resetAuthentification()
    } else if (step === STEPS.ENTER_USER_INFO) {
      this.setState({ step: STEPS.CREATE_PASSWORD })
    }
  }

  _onNextPress = () => {
    const {
      state: { step, email, password, firstName, lastName },
      props: { requestIdentification, requestAuthentification, requestSignup },
    } = this
    Keyboard.dismiss()
    if (step === STEPS.ENTER_EMAIL) {
      if (!requiredPredicate(email)) {
        this.setState({ emailError: ERRORS.EMAIL.EMPTY })
        return
      }
      if (!emailPredicate(email)) {
        this.setState({ emailError: ERRORS.EMAIL.INVALID })
        return
      }
      this.setState({ emailError: null })
      requestIdentification(email)
    } else if (step === STEPS.ENTER_PASSWORD) {
      if (!requiredPredicate(password)) {
        this.setState({ passwordError: ERRORS.PASSWORD.EMPTY })
        return
      }
      this.setState({ passwordError: null })
      requestAuthentification({ email, password })
    } else if (step === STEPS.CREATE_PASSWORD) {
      if (!requiredPredicate(password)) {
        this.setState({ passwordError: ERRORS.PASSWORD.EMPTY })
        return
      }
      this.setState({ step: STEPS.ENTER_USER_INFO, passwordError: null })
    } else if (step === STEPS.ENTER_USER_INFO) {
      if (!(requiredPredicate(firstName) && requiredPredicate(lastName))) {
        this.setState({
          credentialsError: ERRORS.CREDENTIALS.EMPTY,
        })
        return
      }
      this.setState({ credentialsError: null })
      requestSignup({ email, password, firstName, lastName })
    }
  }

  render() {
    const {
      step,
      email,
      password,
      firstName,
      lastName,
      emailError,
      passwordError,
      credentialsError,
    } = this.state
    const { isFetching } = this.props
    return (
      <FormWrapper>
        <Form>
          <FormHead>Email sign in</FormHead>
          {step === STEPS.ENTER_EMAIL ? (
            <EnterEmail
              emailError={emailError}
              onChangeEmail={email => this.setState({ email })}
              email={email}
              onSubmit={this._onNextPress}
            />
          ) : step === STEPS.ENTER_PASSWORD ? (
            <EnterPassword
              onSubmit={this._onNextPress}
              password={password}
              passwordError={passwordError}
              onChangePassword={password => this.setState({ password })}
              showPasswordReset
            />
          ) : step === STEPS.CREATE_PASSWORD ? (
            <EnterPassword
              onSubmit={this._onNextPress}
              password={password}
              passwordError={passwordError}
              onChangePassword={password => this.setState({ password })}
              passwordLabel="Create your password"
            />
          ) : (
            <EnterUserInfo
              firstName={firstName}
              lastName={lastName}
              credentialsError={credentialsError}
              onChangeFirstName={firstName => this.setState({ firstName })}
              onChangeLastName={lastName => this.setState({ lastName })}
              onSubmit={this._onNextPress}
            />
          )}
        </Form>
        <FormFooter>
          <FormButton onPress={this._onBackPress}>Back</FormButton>
          {isFetching ? (
            <Preloader />
          ) : (
            <FormButton semi onPress={this._onNextPress} isOrange>
              {step === STEPS.ENTER_USER_INFO || step === STEPS.ENTER_PASSWORD
                ? 'Done'
                : 'Next'}
            </FormButton>
          )}
        </FormFooter>
      </FormWrapper>
    )
  }
}

export default LoginForm
