import React from 'react'
import PropTypes from 'prop-types'
import SvgUri from 'react-native-svg-uri'

const LikeIcon = ({ strokeColor, fillColor, strokeWidth, ...rest }) => (
  <SvgUri
    {...rest}
    svgXmlData={`<?xml version="1.0" encoding="UTF-8"?>
<svg  viewBox="0 0 48 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path fill="${fillColor || 'none'}" stroke="${strokeColor ||
      'gray'}" stroke-width="${strokeWidth ||
      2}" d=" M12.5999999,2.6 C7.0999999,2.6 2.5999999,7.1 2.5999999,12.6 C2.5999999,19.9 7.1999999,24.7 23.8999999,38.4 C40.5999999,24.7 45.1999999,19.9 45.1999999,12.6 C45.1999999,7.1 40.6999999,2.6 35.1999999,2.6 C30.1999999,2.6 27.4999999,5.6 25.3999999,8 L23.8999999,9.7 L22.3999999,8 C20.2999999,5.6 17.5999999,2.6 12.5999999,2.6 Z" />
</svg>`}
  />
)

LikeIcon.propTypes = {
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fillColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
}

LikeIcon.defaultProps = {
  width: 14.8,
  height: 13.3,
  fillColor: 'none',
  strokeColor: 'gray',
  strokeWidth: 2,
}

export default LikeIcon
