import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ArrowIcon } from '../assets/icons'
import { StyledText, TEXT_SIZE, TEXT_WEIGHT } from './typography'
import { ARROW_ICON_DIRECTION } from '../constants'

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  padding: 10px;
`

const Text = StyledText.extend.attrs({
  size: TEXT_SIZE.XM,
  weight: ({ bold }) => bold && TEXT_WEIGHT.SEMI,
})`
  margin-horizontal: 3px;
`

const Row = styled.View`
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
  align-items: center;
`

const HeaderArrowButton = ({
  showIcon = true,
  left = true,
  bold = false,
  children,
  ...rest
}) => (
  <Touchable {...rest}>
    <Row reverse={!left}>
      {showIcon && (
        <ArrowIcon
          arrowDirection={
            left ? ARROW_ICON_DIRECTION.LEFT : ARROW_ICON_DIRECTION.RIGHT
          }
        />
      )}
      {children && <Text bold={bold}>{children}</Text>}
    </Row>
  </Touchable>
)

HeaderArrowButton.propTypes = {
  left: PropTypes.bool,
  showIcon: PropTypes.bool,
  bold: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
}

export default HeaderArrowButton
