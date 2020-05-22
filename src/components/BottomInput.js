import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Modal, Platform } from 'react-native'
import { CheckIcon } from '../assets/icons'

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const EditWrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
})`
  flex-direction: row;
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  align-items: center;
  justify-content: center;
  width: 53px;
  border-left-width: 1px;
  border-top-width: 1px;
  border-color: ${({ theme }) => theme.color.border};
`

const BlurTouchable = styled.TouchableWithoutFeedback`
  flex: 1;
`

const View = styled.View`
  flex: 1;
`

const EditInput = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
  multiline: true,
  autoFocus: true,
})`
  border-color: ${({ theme }) => theme.color.border};
  font-size: ${({ theme }) => theme.size.l};
  padding: 16px 16px 18px 16px;
  border-top-width: 1px;
  flex: 1;
  max-height: 100px;
  min-height: 53px;
`

class BottomInput extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
    visible: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.text,
  }

  _onChangeText = value => this.setState({ value })

  _onBlur = () => this.props.onCancel()

  _onDone = () => this.props.onSave(this.state.value)

  render() {
    const { value } = this.state
    const { visible } = this.props
    return (
      <Modal
        onRequestClose={this._onBlur}
        transparent={true}
        animationType="slide"
        visible={visible}
      >
        <Container>
          <BlurTouchable onPress={this._onBlur}>
            <View />
          </BlurTouchable>
          <EditWrapper>
            <EditInput
              onBlur={this._onBlur}
              onChangeText={this._onChangeText}
              value={value}
            />
            <Touchable onPress={this._onDone}>
              <CheckIcon />
            </Touchable>
          </EditWrapper>
        </Container>
      </Modal>
    )
  }
}

export default BottomInput
