import React from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, containerBackgroundColor }) =>
    containerBackgroundColor || theme.color.mainWhite};
`

const Indicator = styled.ActivityIndicator.attrs({
  color: ({ theme }) => theme.color.mainOrange,
})``

const Preloader = ({ renderContainer, containerBackgroundColor }) => {
  return renderContainer ? (
    <Container containerBackgroundColor={containerBackgroundColor}>
      <Indicator />
    </Container>
  ) : (
    <Indicator />
  )
}

export default Preloader
