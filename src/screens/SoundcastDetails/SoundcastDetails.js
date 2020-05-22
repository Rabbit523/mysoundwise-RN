import R from 'ramda'
import React from 'react'
import styled from 'styled-components'
import {
  OrangeButton,
  BlurBackground,
  ExploreSoundcastHead,
} from '../../components'
import { Header } from 'react-navigation'
import ActionSheet from 'react-native-actionsheet'
import Tab from './Tab'
import Modal from './Modal'
import { PlayerViewContainer as PlayerView } from '../../containers'
import { numberFormatter, isExists } from '../../utils'
import { URLS, BILLING_CYCLES } from '../../constants'

const Container = styled.View`
  flex: 1;
  padding-top: ${Header.HEIGHT};
`

const PaddingWrapper = styled.View`
  padding: 14px 17px 13px;
`

class SoundcastDetails extends React.Component {
  state = { modalVisible: false, priceIndex: 0 }

  _showModal = () => this.setState({ modalVisible: true, skipFirstStep: false })

  _getAccess = () => this.setState({ modalVisible: true, skipFirstStep: true })

  _hideModal = () =>
    this.setState({ modalVisible: false, skipFirstStep: false })

  // called when the soundcast price is Free
  _handleSubscribe = () => this.props.requestSubscribe(this.props.soundcast)

  _getPriceText = ({ billingCycle, price }) => {
    const priceText = billingCycle
      ? billingCycle === BILLING_CYCLES.ANNUAL
        ? `$${price}/year`
        : billingCycle === BILLING_CYCLES.MONTHLY
          ? `$${price}/month`
          : `$${price}`
      : `$${price}`
    return priceText
  }

  _getPriceOptions = () => {
    const { prices, forSale } = this.props.soundcast
    let options = []
    if (forSale && isExists(prices)) {
      options = R.map(this._getPriceText, prices)
    } else {
      options.push('Free')
    }

    return options
  }

  _showActionSheet = () => this.ActionSheet.show()

  _handleActionSheet = index =>
    index > 0 && this.setState({ priceIndex: index - 1 })

  componentDidMount() {
    this.props.requestExploreSoundcast(this.props.soundcast.soundcastId)
  }

  render() {
    const {
      episodes,
      soundcast,
      isFetching,
      likeEpisode,
      unlikeEpisode,
      bundleSoundcasts,
      isFetchingSubscribe,
      selectBundleSoundcast,
    } = this.props

    const {
      title,
      bundle,
      forSale,
      imageUrl,
      subscribed,
      soundcastId,
      listensCount,
      blurredImageUrl,
      showSubscriberCount,
    } = soundcast

    const { skipFirstStep, modalVisible, priceIndex } = this.state
    const priceOptions = this._getPriceOptions()
    const priceText = priceOptions[priceIndex]

    let option
    if (priceText !== 'Free') {
      option = priceIndex
    }

    const subtitle =
      showSubscriberCount &&
      subscribed > 100 &&
      `${R.pipe(
        R.keys,
        R.length,
        numberFormatter,
      )(subscribed)} subscribers | ${numberFormatter(listensCount)} listens`

    return (
      <PlayerView>
        <Container>
          <BlurBackground imageUrl={blurredImageUrl} />
          <PaddingWrapper>
            <ExploreSoundcastHead
              title={title}
              price={priceText}
              imageUrl={imageUrl}
              subtitle={subtitle}
              isFetching={isFetching}
              onPressPrice={priceOptions.length > 1 && this._showActionSheet}
            />
            <OrangeButton
              style={{ marginTop: 20 }}
              title="GET ACCESS"
              onPress={this._getAccess}
            />
          </PaddingWrapper>
          <Tab
            screenProps={{
              onGetAccess: this._showModal,
              selectBundleSoundcast,
              bundleSoundcasts,
              unlikeEpisode,
              likeEpisode,
              isFetching,
              soundcast,
              episodes,
              bundle,
            }}
          />
        </Container>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title="Access Options"
          options={['Cancel', ...priceOptions]}
          cancelButtonIndex={0}
          onPress={this._handleActionSheet}
        />
        <Modal
          isFree={!forSale}
          priceText={priceText}
          soundcastTitle={title}
          skipFirstStep={skipFirstStep}
          onPressClose={this._hideModal}
          visible={modalVisible}
          subscribe={this._handleSubscribe}
          isFetchingSubscribe={isFetchingSubscribe}
          urlToOpen={`${URLS.CHECKOUT({ soundcastId, option })}`}
        />
      </PlayerView>
    )
  }
}

export default SoundcastDetails
