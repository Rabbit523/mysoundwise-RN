import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Avatar,
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  TEXT_WEIGHT,
} from '../components'
import { formatDateForMonth } from '../utils'

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`

const HeaderText = StyledText.extend.attrs({
  weight: TEXT_WEIGHT.BOLD,
})``

const DateText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_GREY,
  size: TEXT_SIZE.XS,
})``

const HeaderWrapper = styled.View`
  margin-left: 13px;
`

const PublisherHead = ({ title, imageUrl, date, avatarSize }) => (
  <Container>
    <Avatar firstName={title} imageUrl={imageUrl} size={avatarSize} />
    <HeaderWrapper>
      <HeaderText>{title}</HeaderText>
      <DateText>{formatDateForMonth(date)}</DateText>
    </HeaderWrapper>
  </Container>
)

PublisherHead.propTypes = {
  avatarSize: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default PublisherHead
