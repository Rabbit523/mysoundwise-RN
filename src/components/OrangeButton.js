import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StyledText, TEXT_COLOR, TEXT_SIZE, TEXT_WEIGHT } from '../components'

const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  background-color: ${({ theme }) => theme.color.mainOrange};
  border-radius: 8px;
`

const ButtonText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
  weight: TEXT_WEIGHT.BOLD,
  color: TEXT_COLOR.MAIN_WHITE,
})`
    padding: 6px 11px;
    text-align: center;
  `

class OrangeButon extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  render() {
    const { onPress, title, ...rest } = this.props
    return (
      <Button onPress={onPress} {...rest}>
        <ButtonText>{title}</ButtonText>
      </Button>
    )
  }
}

export default OrangeButon
