import { observable, action, configure } from 'mobx';

import childCountryApi from 'Api/campaignChild/childCountry';


configure({enforceActions: 'always'});


class ChildIpStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable error=null;
  @observable Countries=null;

  @observable start_timestamp = undefined;
  @observable end_timestamp = undefined;
  @observable searched = true;

  @action fetchChildCountryStats(page = 1,id,search_value) {
    if(search_value == ''){
      this.searched = true
    }
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    // console.log(`fetching campaign from page ${page}`);
    const limit = this.limit;
    const offset = (page - 1) * limit;
    childCountryApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    }, id)
    .then(childCountry => {
      this.setChildCountry(childCountry)
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
    childCountryApi.getStats({
      offset: offset,
      // limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    }, id)
    .then(childCountry => {
      const search_value = childCountry.countries.filter((country) => {
        return country.country_name_en.toLowerCase().indexOf(search.toLowerCase()) !== -1
      });
      this.setChildCountry(search_value)
    })
    .catch(result => {
      this.statsApiFailed(result);
    });
  }

  @action setChildCountry(childCountry) {
    this.Countries = childCountry;
    this.error = null;
    this.loaded = true;
  }

  @action setLoadFailed({friendly, message}) {
    this.Countries = null;
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
      Countries}) {

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
    this.Countries = Countries;
    this.current_page = current_page;
    this.total_page = total_page;
    this.error = null;
    this.loaded = true;
  }

  @action statsApiFailed({friendly, message}) {
    this.Countries = [];
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action setDateRange(start_timestamp, end_timestamp) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
  }

}


const childIpStore = new ChildIpStore();

export default childIpStore;
