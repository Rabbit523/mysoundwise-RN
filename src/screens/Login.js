import React from 'react'
import styled from 'styled-components'
import {
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
  Preloader,
} from '../components'
import { LoginFormContainer } from '../containers'
import { WelcomeImage } from '../assets/images'
import { Linking } from 'react-native'
import { URLS } from '../constants'

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const BackgroundImage = styled.Image.attrs({
  source: WelcomeImage,
  resizeMode: 'cover',
})`
  flex: 1;
  width: 100%;
`

const BackgroundWrapper = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`

const BackgroundButton = styled.TouchableWithoutFeedback`
  flex: 1;
  width: 100%;
`

const Background = props => (
  <BackgroundWrapper>
    <BackgroundButton {...props}>
      <BackgroundImage />
    </BackgroundButton>
  </BackgroundWrapper>
)

const ButtonsWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  padding: 20px 12px 20px 13px;
`

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })``

const Button = Touchable.extend`
  margin: 12px;
`

const FacebookButton = Button.extend`
  background-color: ${({ theme }) => theme.color.fbBlue};
  box-shadow: 0 2px 4px ${({ theme }) => theme.color.shadow};
`

const OrangeButton = Button.extend`
  background-color: ${({ theme, filled }) =>
    filled ? theme.color.mainOrange : theme.color.mainWhite};
  border-color: ${({ theme }) => theme.color.mainOrange};
  border-width: 2.5px;
  margin-bottom: ${({ single }) => (single ? 70 : 12)};
`

const WhiteText = StyledText.extend.attrs({
  color: TEXT_COLOR.MAIN_WHITE,
  weight: TEXT_WEIGHT.BOLD,
  size: TEXT_SIZE.XL,
})`
  text-align: center;
  padding-top: 14px;
  padding-bottom: 17px;
`

const OrangeText = StyledText.extend.attrs({
  color: TEXT_COLOR.MAIN_ORANGE,
  weight: TEXT_WEIGHT.BOLD,
  size: TEXT_SIZE.XL,
})`
  text-align: center;
  padding-top: 14px;
  padding-bottom: 17px;
`

const PoliticsText = StyledText.extend.attrs({
  size: TEXT_SIZE.XS,
  color: TEXT_COLOR.FONT_GREY,
})``

const Underlined = PoliticsText.extend`
  text-decoration: underline;
`

const PoliticsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const PoliticsInfo = ({ termsOfUseUrl, privacyPoliticsUrl }) => (
  <PoliticsContainer>
    <PoliticsText>By continuing, you accept the </PoliticsText>
    <Touchable onPress={() => Linking.openURL(termsOfUseUrl)}>
      <Underlined>Terms of use</Underlined>
    </Touchable>
    <PoliticsText> and </PoliticsText>
    <Touchable onPress={() => Linking.openURL(privacyPoliticsUrl)}>
      <Underlined>Privacy Politics</Underlined>
    </Touchable>
  </PoliticsContainer>
)

const LoginButtons = ({ onFacebookConnect, onEmailSignIn }) => (
  <ButtonsWrapper>
    <FacebookButton onPress={onFacebookConnect}>
      <WhiteText>Connect with Facebook</WhiteText>
    </FacebookButton>
    <OrangeButton>
      <OrangeText onPress={onEmailSignIn}>
        Sign up or log in with email
      </OrangeText>
    </OrangeButton>
    <PoliticsInfo
      termsOfUseUrl={URLS.TERMS_OF_USE}
      privacyPoliticsUrl={URLS.POLICY}
    />
  </ButtonsWrapper>
)

const STEPS = {
  WELCOME: 0,
  AUTH_TYPE: 1,
  SIGN_IN_WITH_EMAIL: 2,
}

class LoginScreen extends React.Component {
  state = {
    step: STEPS.WELCOME,
    isFetching: true,
  }

  _resetStep = () => this.setState({ step: STEPS.WELCOME })

  render() {
    const { step } = this.state
    const { facebookConnect, theme, isFetching } = this.props

    return (
      <Container>
        <Background onPress={this._resetStep} />
        {isFetching ? (
          <Preloader
            renderContainer
            containerBackgroundColor={theme.color.blackTransparent}
          />
        ) : step === STEPS.WELCOME ? (
          <OrangeButton
            filled
            single
            onPress={() => this.setState({ step: STEPS.AUTH_TYPE })}
          >
            <WhiteText>Sign Up or Log In</WhiteText>
          </OrangeButton>
        ) : step === STEPS.AUTH_TYPE ? (
          <LoginButtons
            onFacebookConnect={() => facebookConnect()}
            onEmailSignIn={() =>
              this.setState({ step: STEPS.SIGN_IN_WITH_EMAIL })
            }
          />
        ) : (
          <LoginFormContainer
            backToButtons={() => this.setState({ step: STEPS.AUTH_TYPE })}
          />
        )}
      </Container>
    )
  }
}
export default LoginScreen
