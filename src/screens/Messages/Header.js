import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Avatar, StyledText, TEXT_SIZE } from '../../components'
import { ArrowIcon } from '../../assets/icons'
import { ARROW_ICON_DIRECTION, HITSLOP_10 } from '../../constants'
import { isExists } from '../../utils'

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const HeaderWrapper = Touchable.extend`
  flex-direction: row;
  align-items: center;
  padding-left: 24px;
  padding-right: 29.5px;
  flex: 1;
`

const HeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
  numberOfLines: 1,
})`
  flex: 1;
  margin-horizontal: 9px;
`

const TitleText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
})`
  text-align: center;
`

const Header = ({
  imageUrl,
  firstName,
  lastName,
  title,
  onPress,
  arrowDown,
  onlyTitle,
}) =>
  onlyTitle ? (
    <TitleText>{title}</TitleText>
  ) : (
    <HeaderWrapper onPress={onPress}>
      {isExists(imageUrl) && (
        <Avatar
          imageUrl={imageUrl}
          size={24}
          firstName={firstName}
          lastName={lastName}
        />
      )}
      <HeaderText>{title}</HeaderText>
      <ArrowIcon
        arrowDirection={
          arrowDown ? ARROW_ICON_DIRECTION.DOWN : ARROW_ICON_DIRECTION.UP
        }
      />
    </HeaderWrapper>
  )

Header.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  onlyTitle: PropTypes.bool,
  arrowDown: PropTypes.bool,
  imageUrl: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
}

export default Header
