import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StyledText, TEXT_COLOR, TEXT_SIZE, Preloader } from '../components'
import { LikeIcon } from '../assets/icons'
import { isExists } from '../utils'
import { HITSLOP_10 } from '../constants'

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const Row = styled.View`
  flex-direction: row;
  flex: 1;
`

const GrayText = StyledText.extend.attrs({
  numberOfLines: 1,
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.XS,
})``

const HeartTouch = Touchable.extend`
  margin-right: 5px;
`

class LikeButton extends React.PureComponent {
  static propTypes = {
    likesCount: PropTypes.number,
    isFetching: PropTypes.bool,
    lastLiked: PropTypes.string,
    userFullName: PropTypes.string,
    placeholder: PropTypes.string,
    onLike: PropTypes.func.isRequired,
    onPressText: PropTypes.func,
    likeIconProps: PropTypes.shape({
      strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      fillColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      width: PropTypes.number,
      height: PropTypes.number,
      strokeWidth: PropTypes.number,
    }),
  }

  // _getLikesText = () => {
  //   const { likesCount, lastLiked, userFullName } = this.props

  //   let result = ''
  //   if (lastLiked === userFullName) {
  //     if (likesCount > 1) {
  //       result = 'You'
  //     } else {
  //       result = 'You like this'
  //     }
  //   } else {
  //     result = lastLiked
  //   }
  //   if (likesCount > 1) {
  //     result = `${
  //       lastLiked.toLowerCase() === 'guest'
  //         ? `${likesCount} ${result}s`
  //         : `${result} & ${likesCount - 1} other${likesCount > 2 ? 's' : ''}`
  //     }`
  //   }
  //   return result
  // }

  _getLikesText = () => {
    const { likesCount, lastLiked, userFullName } = this.props

    // when latest like is guest
    if (lastLiked.toLowerCase() === 'guest') {
      return likesCount + ' likes'
    }

    let prefix = ''
    if (lastLiked === userFullName) {
      // console.log('userFullName = ', userFullName)
      if (likesCount > 1) {
        prefix = 'You'
      } else {
        return 'You like this'
      }
    } else {
      if (likesCount > 1) {
        prefix = lastLiked
      } else {
        return lastLiked
      }
    }
    // Now, $prefix is 'You' or '$User' and likesCount > 1
    return `${prefix} & ${likesCount - 1} other${likesCount > 2 ? 's' : ''}`
  }

  render() {
    const {
      onLike,
      likesCount,
      isFetching,
      onPressText,
      placeholder,
      likeIconProps,
    } = this.props
    return (
      <Row>
        <HeartTouch onPress={onLike}>
          <LikeIcon {...likeIconProps} />
        </HeartTouch>
        {isFetching ? (
          <Preloader />
        ) : R.gt(likesCount, 0) ? (
          <Touchable onPress={onPressText}>
            <GrayText>{this._getLikesText()}</GrayText>
          </Touchable>
        ) : (
          isExists(placeholder) && (
            <Touchable onPress={onPressText}>
              <GrayText>{placeholder}</GrayText>
            </Touchable>
          )
        )}
      </Row>
    )
  }
}

export default LikeButton
