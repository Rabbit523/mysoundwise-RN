import icon from './Back.png'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ARROW_ICON_DIRECTION } from '../../../constants'

const ArrowIcon = styled.Image.attrs({
  source: icon,
})`
  width: 17.98px;
  height: 17.98px;
  resize-mode: contain;
  transform: rotateZ(
    ${({ arrowDirection }) =>
      arrowDirection === ARROW_ICON_DIRECTION.LEFT
        ? '0deg'
        : arrowDirection === ARROW_ICON_DIRECTION.UP
          ? '90deg'
          : arrowDirection === ARROW_ICON_DIRECTION.RIGHT
            ? '180deg'
            : '270deg'}
  );
`

ArrowIcon.propTypes = {
  arrowDirection: PropTypes.oneOf([
    ARROW_ICON_DIRECTION.LEFT,
    ARROW_ICON_DIRECTION.UP,
    ARROW_ICON_DIRECTION.RIGHT,
    ARROW_ICON_DIRECTION.DOWN,
  ]).isRequired,
}

ArrowIcon.defaultProps = {
  arrowDirection: ARROW_ICON_DIRECTION.LEFT,
}

export default ArrowIcon
