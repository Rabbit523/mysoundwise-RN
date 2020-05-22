import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Modal as RNModal } from 'react-native'
import { ArrowIcon } from '../assets/icons'
import { ARROW_ICON_DIRECTION } from '../constants'

const ModalContainer = styled.View`
  padding-top: 22px;
  flex: 1;
`

const CloseModalButton = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  padding: 6px 14px;
`

const CloseModal = props => (
  <CloseModalButton {...props}>
    <ArrowIcon arrowDirection={ARROW_ICON_DIRECTION.DOWN} />
  </CloseModalButton>
)

const Modal = ({ children, onCloseModal, ...rest }) => (
  <RNModal
    {...rest}
    onRequestClose={onCloseModal}
    animationType="slide"
    transparent={false}
  >
    <ModalContainer>
      <CloseModal onPress={onCloseModal} />
      {children}
    </ModalContainer>
  </RNModal>
)

Modal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default Modal
