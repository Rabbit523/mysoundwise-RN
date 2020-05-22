import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CachedImage } from 'react-native-cached-image'
import { isExists } from '../utils'

const Image = styled(CachedImage)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`

const Filler = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: ${({ theme }) => theme.color.blurBackground};
`

const BlurBackground = ({ imageUrl }) =>
  isExists(imageUrl) ? <Image source={{ uri: imageUrl }} /> : <Filler />

BlurBackground.propTypes = {
  imageUrl: PropTypes.string,
}

export default BlurBackground
