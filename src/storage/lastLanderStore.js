import { observable, action, configure } from 'mobx';

import lastChildLanderApi from 'Api/campaignChild/lastLander';


configure({enforceActions: 'always'});


class ChildLanderStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable error=null;
  @observable childLanders=null;
  @observable campaign_id=null;
  @observable start_timestamp = undefined;
  @observable end_timestamp = undefined;
  @observable searched = true;

  @action fetchChildLanderStats(page = 1,campaign_id,path_id,search_value) {
    if(search_value == ''){
      this.searched = true
    }
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    this.campaign_id = campaign_id;
    // console.log(`fetching campaign from page ${page}`);

    const limit = this.limit;
    const offset = (page - 1) * limit;
    lastChildLanderApi.getStats({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    }, campaign_id, path_id)
    .then(childLander => {
      this.setChildLander(childLander)
    })
    .catch(result => {
      this.statsApiFailed(result);
    });
  }

  @action searchPage(page = 1,campaign_id,path_id,search){
    if(search!=''){
      this.searched = false
    }
    this.loaded = false;
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    const limit = this.limit;
    const offset = (page - 1) * limit;
    lastChildLanderApi.getStats({
      offset: offset,
      // limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    }, campaign_id, path_id)
    .then(childLander => {
      const search_value = childLander.landers.filter((lander) => {
        return lander.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
      });
      this.setChildLander(search_value)
    })
    .catch(result => {
      this.statsApiFailed(result);
    });
  }

  @action setChildLander(childLander) {
    this.childLanders = childLander;
    this.error = null;
    this.loaded = true;
  }

  @action setLoadFailed({friendly, message}) {
    this.childLanders = null;
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
      childLanders}) {

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
    this.childLanders = childLanders;
    this.current_page = current_page;
    this.total_page = total_page;
    this.error = null;
    this.loaded = true;
  }

  @action statsApiFailed({friendly, message}) {
    this.childLanders = [];
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action setDateRange(start_timestamp, end_timestamp) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
  }

}


const childLanderStore = new ChildLanderStore();

export default childLanderStore;
