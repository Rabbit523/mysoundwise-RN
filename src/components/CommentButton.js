import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../components'
import { CommentIcon } from '../assets/icons'
import { isExists } from '../utils'

const TouchableRow = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  flex: 1;
  justify-content: ${({ rightAlign }) =>
    rightAlign ? 'flex-end' : 'flex-start'};
`

const GrayText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.XS,
})`
  margin-left: 14px;
`

export const CommentButton = ({ commentsCount = 0, placeholder, ...rest }) => (
  <TouchableRow rightAlign {...rest}>
    <CommentIcon />
    {R.gt(commentsCount, 0) ? (
      <GrayText>
        {commentsCount}
        {commentsCount === 1 ? ' comment' : ' comments'}
      </GrayText>
    ) : (
      isExists(placeholder) && <GrayText>{placeholder}</GrayText>
    )}
  </TouchableRow>
)

CommentButton.propTypes = {
  commentsCount: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
}

export default CommentButton
