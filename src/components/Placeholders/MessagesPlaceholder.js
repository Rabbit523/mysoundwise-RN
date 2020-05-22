import React from 'react'
import styled from 'styled-components'
import { StyledText, TEXT_SIZE } from '../typography'
import { MessagePlaceholderImage } from '../../assets/images'

const PlaceholderWrapper = styled.View`
  align-items: center;
  flex: 1;
  padding-top: 72px;
`

const PlaceholderText = StyledText.extend.attrs({
  size: TEXT_SIZE.L,
})`
  margin-top: 40px;
  text-align: center;
  padding-horizontal: 56px;
`

const MessagesPlaceholder = () => (
  <PlaceholderWrapper>
    <MessagePlaceholderImage />
    <PlaceholderText>
      This soundcast publisher hasn’t sent you any messages yet
    </PlaceholderText>
  </PlaceholderWrapper>
)

export default MessagesPlaceholder
