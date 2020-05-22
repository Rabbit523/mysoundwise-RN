import styled from 'styled-components'
import { PLAYER_BAR_HEIGHT } from '../constants'

const PlayerView = styled.View`
  margin-bottom: ${({ isPlayerShown }) =>
    isPlayerShown ? PLAYER_BAR_HEIGHT : 0}px;
  flex: 1;
`

export default PlayerView
