import React from 'react'
import PropTypes from 'prop-types'
import SvgUri from 'react-native-svg-uri'
import theme from '../../../theme'

const PlayIcon = ({ strokeColor, fillColor, strokeWidth, ...rest }) => (
  <SvgUri
    {...rest}
    svgXmlData={`<?xml version="1.0" encoding="UTF-8"?>
<svg  viewBox="0 0 168 216" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path fill="${fillColor ||
              theme.color.mainOrange}" stroke="${strokeColor ||
      'none'}" stroke-width="${strokeWidth ||
      0}" d="M160.388425,93.9434535 C170.289131,100.244944 170.289131,115.771297 160.388425,122.040305 L14.5589797,214.548781 C8.1182789,218.641501 0,213.590565 0,205.486329 L0,10.5136711 C0,2.4094348 8.1182789,-2.64150133 14.5589797,1.45121875 L160.388425,93.9434535 Z" />
</svg>`}
  />
)

PlayIcon.propTypes = {
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fillColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
}

PlayIcon.defaultProps = {
  width: 14,
  height: 18,
  fillColor: theme.color.mainOrange,
  strokeColor: 'none',
  strokeWidth: 0,
}

export default PlayIcon
