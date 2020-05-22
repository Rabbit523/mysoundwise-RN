import icon from './PlayCircleGray.png'
import activeIcon from './PlayCircle.png'

import styled from 'styled-components'

const PlayCircleIcon = styled.Image.attrs({
  source: ({ active }) => (active ? activeIcon : icon),
})`
  width: 35px;
  height: 35px;
`

export default PlayCircleIcon
