import { observable, action, configure } from 'mobx';

import childOfferApi from 'Api/campaignChild/childOffer';


configure({enforceActions: 'always'});


class ChildOfferStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable error=null;
  @observable childOffers=null;
  @observable campaign_id=null;
  @observable campaign_name=null;
  @observable start_timestamp = undefined;
  @observable end_timestamp = undefined;
  @observable searched = true;

  @action fetchChildOfferStats(page = 1,id,search_value,name) {
    if(search_value == ''){
      this.searched = true
    }
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    this.campaign_id = id;
    this.campaign_name = name;
    // console.log(`fetching campaign from page ${page}`);

    const limit = this.limit;
    const offset = (page - 1) * limit;
    childOfferApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    }, id)
    .then(childOffer => {
      this.setChildOffer(childOffer)
    })
    .catch(result => {
      this.statsApiFailed(result);
    });
  }

  @action searchPage(page = 1,id,search){
    if(search!=''){
      this.searched = false
    }
    this.loaded = false;
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    const limit = this.limit;
    const offset = (page - 1) * limit;
    childOfferApi.getStats({
      offset: offset,
      // limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    }, id)
    .then(childOffer => {
      const search_value = childOffer.offers.filter((offer) => {
        return offer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
      });
      this.setChildOffer(search_value)
    })
    .catch(result => {
      this.statsApiFailed(result);
    });
  }

  @action setChildOffer(childOffer) {
    this.childOffers = childOffer;
    this.error = null;
    this.loaded = true;
  }

  @action setLoadFailed({friendly, message}) {
    this.childOffers = null;
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action statsApiSucceed({
      limit,
      offset,
      total,
      start_timestamp,
      end_timestamp,
      current_page,
      childOffers}) {

    let page_div = Math.trunc(total / limit);
    let page_mod = total % limit;
    let total_page = page_div;
    if(page_div == 0) {
      total_page = 1;
    } else if (page_mod != 0) {
      total_page = page_div + 1;
    };
    this.limit = limit;
    this.offset = offset;
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
    this.childOffers = childOffers;
    this.current_page = current_page;
    this.total_page = total_page;
    this.error = null;
    this.loaded = true;
  }

  @action statsApiFailed({friendly, message}) {
    this.childOffers = [];
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action setDateRange(start_timestamp, end_timestamp) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
  }

}


const childOfferStore = new ChildOfferStore();

export default childOfferStore;
