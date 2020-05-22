import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CommentPlaceholderImage } from '../../assets/images'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../typography'

const PlaceholderWrapper = styled.View`
  align-items: center;
  flex: 1;
  padding-top: 31px;
`

const PlaceholderGrayText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_GREY,
})`
  margin-top: 14px;
  margin-bottom: 10px;
  text-align: center;
  padding-horizontal: 56px;
`

const PlaceholderText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
})`
  text-align: center;
  padding-horizontal: 38px;
`

const CommentsPlaceholder = ({ grayText, blackText }) => (
  <PlaceholderWrapper>
    <CommentPlaceholderImage />
    {!!grayText && <PlaceholderGrayText>{grayText}</PlaceholderGrayText>}
    <PlaceholderText>{blackText}</PlaceholderText>
  </PlaceholderWrapper>
)

CommentsPlaceholder.propTypes = {
  grayText: PropTypes.string,
  blackText: PropTypes.string.isRequired,
}

export default CommentsPlaceholder
