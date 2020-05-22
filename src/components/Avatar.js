import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CachedImage } from 'react-native-cached-image'
import { Platform } from 'react-native'
import { isExists } from '../utils'

const ImageAvatar = styled(CachedImage).attrs({
  imageStyle: ({ theme, size }) => ({
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: size / 2,
  }),
})`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

const SymbolAvatar = styled.View`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  justify-content: center;
  border-radius: ${({ size }) => size / 2};
  align-items: center;
  background-color: ${({ theme }) => theme.color.avatarGray};
`

const SymbolAvatarText = styled.Text`
  ${Platform.OS === 'android' ? 'font-family: Roboto;' : ''}
  font-size: ${({ size }) => size / 2};
  text-align: center;
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.fontBlack};
`

const Avatar = ({ imageUrl, firstName, lastName, size }) =>
  R.is(String, imageUrl) &&
  !R.isEmpty(imageUrl) &&
  !R.contains('placeholder', imageUrl) ? (
    <ImageAvatar size={size} source={{ uri: imageUrl }} />
  ) : (
    <SymbolAvatar size={size}>
      <SymbolAvatarText size={size}>
        {isExists(firstName) && firstName[0]}
        {isExists(lastName) && lastName[0]}
      </SymbolAvatarText>
    </SymbolAvatar>
  )

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.number.isRequired,
}

export default Avatar
