import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StyledText, TEXT_COLOR, TEXT_WEIGHT, TEXT_SIZE } from './typography'
import SoundcastImage from './SoundcastImage'
import { isExists } from '../utils'

const SoundHeadWrapper = styled.View`
  flex-direction: row;
`

const SoundcastHeader = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
  weight: TEXT_WEIGHT.BOLD,
  color: TEXT_COLOR.ALMOST_BLACK,
})``

const SoundcastHeaderSubtitle = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
})`
  margin-top: 4px;
`

const SoundcastRightBlock = styled.View`
  flex-shrink: 1;
  flex: 1;
  margin-left: 23px;
`

const SoundcastHead = ({ imageUrl, title, subtitle }) => (
  <SoundHeadWrapper>
    <SoundcastImage imageUrl={imageUrl} />
    <SoundcastRightBlock>
      <SoundcastHeader>{title}</SoundcastHeader>
      {isExists(subtitle) && (
        <SoundcastHeaderSubtitle>{subtitle}</SoundcastHeaderSubtitle>
      )}
    </SoundcastRightBlock>
  </SoundHeadWrapper>
)

SoundcastHead.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

export default SoundcastHead
