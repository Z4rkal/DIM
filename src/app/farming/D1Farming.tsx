import React from 'react';
import { DimStore } from '../inventory/store-types';
import { t } from 'app/i18next-t';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { setFarmingSetting } from '../settings/actions';
import _ from 'lodash';
import { farmingStoreSelector } from './reducer';
import './farming.scss';
import { D1FarmingService } from './farming.service';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface StoreProps {
  makeRoomForItems: boolean;
  store?: DimStore;
}

function mapStateToProps() {
  const storeSelector = farmingStoreSelector();
  return (state: RootState): StoreProps => ({
    makeRoomForItems: state.settings.farming.makeRoomForItems,
    store: storeSelector(state)
  });
}

const mapDispatchToProps = {
  setFarmingSetting
};
type DispatchProps = typeof mapDispatchToProps;

type Props = StoreProps & DispatchProps;

class D1Farming extends React.Component<Props> {
  render() {
    const { store, makeRoomForItems } = this.props;

    return (
      <TransitionGroup component={null}>
        {store && (
          <CSSTransition clsx="farming" timeout={{ enter: 500, exit: 500 }}>
            <div id="item-farming">
              <div>
                <p>
                  {t(makeRoomForItems ? 'FarmingMode.Desc' : 'FarmingMode.MakeRoom.Desc', {
                    store: store.name,
                    context: store.gender && store.gender.toLowerCase()
                  })}
                  {/*
                    t('FarmingMode.Desc')
                    t('FarmingMode.Desc_male')
                    t('FarmingMode.Desc_female')
                    t('FarmingMode.MakeRoom.Desc')
                    t('FarmingMode.MakeRoom.Desc_male')
                    t('FarmingMode.MakeRoom.Desc_female')
                  */}
                </p>
                <p>
                  <input
                    name="make-room-for-items"
                    type="checkbox"
                    checked={makeRoomForItems}
                    onChange={this.makeRoomForItemsChanged}
                  />
                  <label htmlFor="make-room-for-items" title={t('FarmingMode.MakeRoom.Tooltip')}>
                    {t('FarmingMode.MakeRoom.MakeRoom')}
                  </label>
                </p>
              </div>

              <div>
                <button onClick={D1FarmingService.stop}>{t('FarmingMode.Stop')}</button>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }

  private makeRoomForItemsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked;
    this.props.setFarmingSetting('makeRoomForItems', value);
  };
}

export default connect<StoreProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(D1Farming);
