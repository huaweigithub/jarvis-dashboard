import { observable, action, configure } from 'mobx';

import landerApi from 'Api/landerApi';


configure({enforceActions: 'always'});


class LanderPageStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable error=null;
  @observable landers=[];

  @observable start_timestamp = undefined;
  @observable end_timestamp = undefined;
  @observable searched = true;

  @action fetchLanderStats(page = 1,search_value) {
    if(search_value == ''){
      this.searched = true
    }
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    // console.log(`fetching campaign from page ${page}`);

    const limit = this.limit;
    const offset = (page - 1) * limit;
    landerApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    })
      .then(({total, offset, limit, start_timestamp, end_timestamp, landers}) => {
        const new_limit = (limit == null)? this.limit: limit;

        this.statsApiSucceed({
          limit: new_limit,
          offset: offset,
          total: total,
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp,
          landers: landers,
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
    this.loaded = false;
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    // console.log(`fetching campaign from page ${page}`);

    console.log('lander search....',search)
    const limit = this.limit;
    const offset = (page - 1) * limit;
    landerApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    })
      .then(({start_timestamp, end_timestamp, landers}) => {
        // const new_limit = (limit == null)? this.limit: limit;
        const search_value = landers.filter((lander) => {
          return lander.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        });
        this.apiSearchSucceed({
          // limit: new_limit,
          // offset: offset,
          // total: total,
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp,
          landers: search_value,
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
    landers}) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
    this.landers = landers;
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
      landers}) {

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
    this.landers = landers;
    this.current_page = current_page;
    this.total_page = total_page;
    this.error = null;
    this.loaded = true;
  }

  @action statsApiFailed({friendly, message}) {
    this.landers = [];
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action setDateRange(start_timestamp, end_timestamp) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
  }

}


const landerPageStore = new LanderPageStore();

export default landerPageStore;
