import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Modal as RNModal, Linking } from 'react-native'
import {
  OrangeButton,
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
  Preloader,
} from '../../components'
import { HITSLOP_10 } from '../../constants'
import * as NavigationService from '../../NavigationService'

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.blackTransparent};
  align-items: center;
  justify-content: center;
`

const Background = styled.TouchableWithoutFeedback`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const Filler = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const AlertWrapper = styled.View`
  margin-horizontal: 52px;
  padding: 23px 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.mainWhite};
  align-items: center;
`

const AlertText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
  color: TEXT_COLOR.FONT_BLACK,
  weight: TEXT_WEIGHT.BOLD,
})`
  text-align: center;
  margin-bottom: 15px;
`

const CancelButtonWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})`
  margin-top: 22px;
`

const CancelButtonText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_GREY,
})`
  text-align: center;
`

const CancelButton = props => (
  <CancelButtonWrapper {...props}>
    <CancelButtonText>Maybe later</CancelButtonText>
  </CancelButtonWrapper>
)

const Alert = ({ text, buttonText, onPressAccess, onPressCancel }) => (
  <AlertWrapper>
    <AlertText>{text}</AlertText>
    <OrangeButton
      style={{ alignSelf: 'stretch' }}
      onPress={onPressAccess}
      title={buttonText}
    />
    {onPressCancel && <CancelButton onPress={onPressCancel} />}
  </AlertWrapper>
)

Alert.propTypes = {
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onPressAccess: PropTypes.func.isRequired,
  onPressCancel: PropTypes.func,
}

class Modal extends React.PureComponent {
  _handlePressAccess = () => {
    const { urlToOpen, onPressClose } = this.props
    if (urlToOpen) {
      Linking.openURL(urlToOpen)
    }
    onPressClose()
  }

  state = { subscribeRequested: false }

  _handleSubscribe = () => {
    this.setState({ subscribeRequested: true })
    this.props.subscribe()
  }

  _goToSoundcasts = () => {
    this.setState({ subscribeRequested: false })
    this.props.onPressClose()
    NavigationService.navigate('Soundcasts')
  }

  _getSuccessText = () => `Success!
  ${this.props.soundcastTitle} is added to your subscriptions.`

  componentDidUpdate() {
    const { skipFirstStep, isFree } = this.props
    const { subscribeRequested } = this.state
    if (skipFirstStep && isFree && !subscribeRequested) {
      this._handleSubscribe()
    }
  }

  render() {
    const {
      isFree,
      priceText,
      onPressClose,
      skipFirstStep,
      isFetchingSubscribe,
      ...rest
    } = this.props

    const text = isFree
      ? 'Subscribe to this soundcast to read and add comments'
      : `Get this soundcast for ${priceText}`

    return (
      <RNModal
        {...rest}
        transparent={true}
        animationType="fade"
        onRequestClose={onPressClose}
      >
        <Container>
          <Background onPress={onPressClose}>
            <Filler />
          </Background>
          {this.state.subscribeRequested ? (
            isFetchingSubscribe ? (
              <Preloader
                renderContainer
                containerBackgroundColor="transparent"
              />
            ) : (
              <Alert
                text={this._getSuccessText()}
                buttonText="OK"
                onPressAccess={this._goToSoundcasts}
              />
            )
          ) : (
            <Alert
              text={text}
              buttonText="GET ACCESS"
              onPressCancel={onPressClose}
              onPressAccess={
                isFree ? this._handleSubscribe : this._handlePressAccess
              }
            />
          )}
        </Container>
      </RNModal>
    )
  }
}

export default Modal
