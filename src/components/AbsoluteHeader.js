import { Platform } from 'react-native'
import { Header } from 'react-navigation'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const AbsoluteHeader = styled.View`
  height: ${Header.HEIGHT};
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor || theme.color.headerBackgroundColor};
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  border-bottom-width: 0;
  shadow-radius: 0;
  elevation: 0;
  flex-direction: row;
  align-items: center;
  padding-top: ${Platform.OS === 'ios' ? 20 : 0};
`

AbsoluteHeader.propTypes = {
  backgroundColor: PropTypes.string,
}

export default AbsoluteHeader
