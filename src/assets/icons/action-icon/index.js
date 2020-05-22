import icon from './Action.png'
import styled from 'styled-components'

const ActionIcon = styled.Image.attrs({
  source: icon,
})`
  width: 19px;
  height: 19px;
  resize-mode: contain;
`

export default ActionIcon
