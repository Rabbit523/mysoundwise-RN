import icon from './Description.png'
import styled from 'styled-components'

const DescriptionIcon = styled.Image.attrs({
  source: icon,
})`
  width: 19px;
  height: 19px;
  resize-mode: contain;
`

export default DescriptionIcon
