import { observable, action, configure } from 'mobx';

import offerApi from 'Api/offerApi';


configure({enforceActions: 'always'});


class OfferPageStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable error=null;
  @observable offers=[];

  @observable start_timestamp = undefined;
  @observable end_timestamp = undefined;
  @observable searched = true;

  @action fetchOfferStats(page = 1,search_value) {
    if(search_value == ''){
      this.searched = true
    }
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    // console.log(`fetching campaign from page ${page}`);

    const limit = this.limit;
    const offset = (page - 1) * limit;
    offerApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    })
      .then(({total, offset, limit, start_timestamp, end_timestamp, offers}) => {
        const new_limit = (limit == null)? this.limit: limit;

        this.statsApiSucceed({
          limit: new_limit,
          offset: offset,
          total: total,
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp,
          offers: offers,
          current_page: page,
        });
      })
      .catch(result => {
        this.statsApiFailed(result);
      });
  }

  @action searchPage(page = 1,search){
    if(search!=''){
      this.searched = false
    }
    this.current_page = page;
    this.error = null;
    this.loaded = false;

    const limit = this.limit;
    const offset = (page - 1) * limit;
    offerApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    })
      .then(({start_timestamp, end_timestamp, offers}) => {
        // const new_limit = (limit == null)? this.limit: limit;
        const search_value = offers.filter((offer) => {
          return offer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        });
        this.apiSearchSucceed({
          // limit: new_limit,
          // offset: offset,
          // total: total,
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp,
          offers: search_value,
          current_page: page,
        });
      })
      .catch(result => {
        this.statsApiFailed(result);
      });
  }

  @action apiSearchSucceed({
    start_timestamp,
    end_timestamp,
    current_page,
    offers}) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
    this.offers = offers;
    this.current_page = current_page;
    this.error = null;
    this.loaded = true;
  }

  @action statsApiSucceed({
      limit,
      offset,
      total,
      start_timestamp,
      end_timestamp,
      current_page,
      offers}) {

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
    this.offers = offers;
    this.current_page = current_page;
    this.total_page = total_page;
    this.error = null;
    this.loaded = true;
  }

  @action statsApiFailed({friendly, message}) {
    this.offers = [];
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action setDateRange(start_timestamp, end_timestamp) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
  }

}


const offerPageStore = new OfferPageStore();

export default offerPageStore;
