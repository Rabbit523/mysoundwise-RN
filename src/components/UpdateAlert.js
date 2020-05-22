import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Modal, Platform } from 'react-native'
import {
  OrangeButton,
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
} from '../components'
import { Bar } from 'react-native-progress'
import theme from '../theme'

const ProgressBar = styled(Bar).attrs({
  width: null,
  borderColor: theme.color.mainOrange,
  color: theme.color.mainOrange,
  borderRadius: 2,
})`
  margin-vertical: 10px;
`

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.blackTransparent};
  align-items: center;
  justify-content: center;
`

const AlertWrapper = styled.View`
  margin-horizontal: 52px;
  padding: 23px 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const AlertText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
  color: TEXT_COLOR.FONT_BLACK,
  weight: TEXT_WEIGHT.BOLD,
})`
  text-align: center;
  margin-bottom: 15px;
`

class UpdateAlert extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onPressOk: PropTypes.func.isRequired,
    progress: PropTypes.number.isRequired,
    okButtonText: PropTypes.string.isRequired,
    onPressOkAndroid: PropTypes.func.isRequired,
    androidRestartText: PropTypes.string.isRequired,
    progressStatusText: PropTypes.string.isRequired,
  }

  _handleRequestClose = () => {
    const { progress, onPressOkAndroid } = this.props
    if (progress >= 1) {
      onPressOkAndroid()
    }
  }

  render() {
    const {
      text,
      visible,
      progress,
      onPressOk,
      okButtonText,
      onPressOkAndroid,
      progressStatusText,
      androidRestartText,
    } = this.props

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={this._handleRequestClose}
      >
        <Container>
          <AlertWrapper>
            <AlertText>{text}</AlertText>
            <AlertText>{progressStatusText}</AlertText>
            <ProgressBar progress={progress} />
            {progress >= 1 && (
              <React.Fragment>
                <OrangeButton
                  onPress={
                    Platform.OS === 'android' ? onPressOkAndroid : onPressOk
                  }
                  title={okButtonText}
                />
                {Platform.OS === 'android' && (
                  <AlertText>{androidRestartText}</AlertText>
                )}
              </React.Fragment>
            )}
          </AlertWrapper>
        </Container>
      </Modal>
    )
  }
}

export default UpdateAlert
