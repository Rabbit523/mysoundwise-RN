import icon from './Radio.png'
import activeIcon from './RadioActive.png'
import styled from 'styled-components'

const RadioIcon = styled.Image.attrs({
  source: ({ active }) => (active ? activeIcon : icon),
})``

export default RadioIcon
