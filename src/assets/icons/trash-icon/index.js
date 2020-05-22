import icon from './Trash.png'
import styled from 'styled-components'

const SearchIcon = styled.Image.attrs({
  source: icon,
})`
  width: 35px;
  height: 35px;
  resize-mode: contain;
  transform: scale(0.6, 0.6);
`

export default SearchIcon
