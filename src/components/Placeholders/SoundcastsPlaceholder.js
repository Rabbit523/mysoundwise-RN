import React from 'react'
import styled from 'styled-components'
import OrangeButton from '../OrangeButton'
import { StyledText, TEXT_SIZE, TEXT_COLOR } from '../typography'
import { SoundcastPlaceholderImage } from '../../assets/images'
import * as NavigationService from '../../NavigationService'

const PlaceholderWrapper = styled.View`
  align-items: center;
  padding: 25px;
`

const PlaceholderText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
  color: TEXT_COLOR.FONT_GREY,
})`
  margin-vertical: 25px;
  text-align: center;
  padding-horizontal: 25px;
`

const SoundcastsPlaceholder = () => (
  <PlaceholderWrapper>
    <SoundcastPlaceholderImage />
    <PlaceholderText>You haven’t added any soundcast yet</PlaceholderText>
    <OrangeButton
      style={{ alignSelf: 'stretch' }}
      title="Check out some soundcasts"
      onPress={() => NavigationService.navigate('Explore')}
    />
  </PlaceholderWrapper>
)

export default SoundcastsPlaceholder
