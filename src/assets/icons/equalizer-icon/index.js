import icon from './Equalizer.gif'
import styled from 'styled-components'

const EqualizerIcon = styled.Image.attrs({
  source: icon,
})`
  width: 35px;
  height: 35px;
  resize-mode: contain;
`

export default EqualizerIcon
