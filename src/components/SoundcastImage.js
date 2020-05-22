import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CachedImage } from 'react-native-cached-image'

import { isExists } from '../utils'

const Image = styled(CachedImage)`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

const ShadowContainer = styled.View`
  elevation: 3;
  shadow-offset: 2px 4px;
  shadow-opacity: 0.7;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  shadow-color: ${({ theme }) => theme.color.mainBlack};
  background-color: ${({ theme, showBackground }) =>
    showBackground ? `${theme.color.mainOrange};` : `white`};
`

const SoundcastImage = ({ imageUrl, size = 77 }) => (
  <ShadowContainer showBackground={!isExists(imageUrl)} size={size}>
    {isExists(imageUrl) && <Image size={size} source={{ uri: imageUrl }} />}
  </ShadowContainer>
)

SoundcastImage.propTypes = {
  imageUrl: PropTypes.string,
}

export default SoundcastImage
