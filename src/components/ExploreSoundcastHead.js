import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StyledText, TEXT_COLOR, TEXT_WEIGHT, TEXT_SIZE } from './typography'
import SoundcastImage from './SoundcastImage'
import Preloader from './Preloader'
import theme from '../theme'
import { HITSLOP_10 } from '../constants'

const SoundHeadWrapper = styled.View`
  flex-direction: row;
`

const SoundcastHeader = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
  weight: TEXT_WEIGHT.BOLD,
  color: TEXT_COLOR.ALMOST_BLACK,
  numberOfLines: 2,
})``

const SoundcastHeaderSubtitle = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_PURPLE,
})`
  flex: 1;
`

const Touchable = styled.TouchableOpacity.attrs({
  hitSlop: HITSLOP_10,
  activeOpacity: 0.8,
})``

const SoundcastHeaderPrice = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
  weight: TEXT_WEIGHT.BOLD,
  color: TEXT_COLOR.FONT_PURPLE,
})`
  line-height: ${theme.size.xl};
`

const SoundcastRightBlock = styled.View`
  flex-shrink: 1;
  flex: 1;
  margin-left: 23px;
  ${({ spaceBetween }) =>
    spaceBetween ? 'justify-content: space-between;' : ''};
`

const ExploreSoundcastHead = ({
  title,
  price,
  subtitle,
  imageUrl,
  isFetching,
  onPressPrice,
}) => (
  <SoundHeadWrapper>
    <SoundcastImage size={90} imageUrl={imageUrl} />
    <SoundcastRightBlock spaceBetween={!subtitle}>
      <SoundcastHeader>{title}</SoundcastHeader>
      {subtitle &&
        (isFetching ? (
          <Preloader />
        ) : (
          <SoundcastHeaderSubtitle>{subtitle}</SoundcastHeaderSubtitle>
        ))}
      <Touchable
        onPress={onPressPrice ? onPressPrice : undefined}
        disabled={!onPressPrice}
      >
        <SoundcastHeaderPrice>{price}</SoundcastHeaderPrice>
      </Touchable>
    </SoundcastRightBlock>
  </SoundHeadWrapper>
)

ExploreSoundcastHead.propTypes = {
  imageUrl: PropTypes.string,
  isFetching: PropTypes.bool,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onPressPrice: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

export default ExploreSoundcastHead
