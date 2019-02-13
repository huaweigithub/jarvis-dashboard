import { observable, action, configure } from 'mobx';

import logTraceApi from 'Api/logTraceApi';


configure({enforceActions: 'always'});


class CampaignSummaryPaginationStore {

  @observable current_page=1;
  @observable total_page=1;
  @observable limit=50;
  @observable loaded=false;
  @observable disabled=false;
  @observable error=null;
  @observable campaign_summary=[];

  @observable start_timestamp = undefined;
  @observable end_timestamp = undefined;
  @observable searched = true;

  @action fetchCampaignSummary(page = 1,search_value) {
    this.current_page = page;
    this.error = null;
    this.loaded = false;
    if(search_value == ''){
      this.searched = true
    }

    const limit = this.limit;
    const offset = (page - 1) * limit;
    logTraceApi.fetchSummary({
      offset: offset,
      limit: limit,
      start_timestamp: this.start_timestamp,
      end_timestamp: this.end_timestamp,
    })
      .then(({total, offset, limit, start_timestamp, end_timestamp, data}) => {
        const new_limit = (limit == null)? this.limit: limit;
        this.apiSucceed({
          limit: new_limit,
          offset: offset,
          total: total,
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp,
          campaign_summary: data,
          current_page: page,
        });
      })
      .catch(result => {
        this.apiFailed(result);
      });
  }

  @action apiSucceed({
      limit,
      offset,
      total,
      start_timestamp,
      end_timestamp,
      current_page,
      campaign_summary}) {

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
    // console.log(`set campaign_summary to `, campaign_summary);
    this.campaign_summary = campaign_summary;
    this.current_page = current_page;
    this.total_page = total_page;
    this.error = null;
    this.loaded = true;
  }

  @action apiSearchSucceed({
      start_timestamp,
      end_timestamp,
      current_page,
      campaign_summary}) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
    this.campaign_summary = campaign_summary;
    this.current_page = current_page;
    this.error = null;
    this.loaded = true;
  }

  @action searchSucceed({
    current_page,
    campaign_summary
  }){
    this.campaign_summary = campaign_summary;
    this.current_page = current_page;
  }

  @action statusLoad(campaign_id,key){
    this.disabled = key
  }

  @action apiFailed({friendly, message}) {
    this.campaign_summary = [];
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action searchPage(page = 1,search){
    if(search!=''){
      this.searched = false
    }
    this.loaded = false;
    this.current_page = page;
    logTraceApi.fetchSummary(
      {
        start_timestamp: this.start_timestamp,
        end_timestamp: this.end_timestamp,
      }
    )
    .then(({start_timestamp, end_timestamp, data}) => {
      const campaign_summary_ = data.filter((campaign) => {
        return campaign.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
      });
      this.apiSearchSucceed({
        start_timestamp: start_timestamp,
        end_timestamp: end_timestamp,
        campaign_summary: campaign_summary_,
        current_page: page,
      });
    })
    .catch(result => {
      this.apiFailed(result);
    });
  }

  @action setCampaignSettings(campaign_id, settings) {
    // console.log(`updating campaign ${campaign_id} settings to`, settings);
    let key_value = {};
    settings.map((setting) => {
      key_value[setting['name']] = setting['content'];
    });

    this.campaign_summary.map((campaign, index) => {
      if(campaign['campaign_id'] == campaign_id) {
        console.log(`set campaign ${campaign_id} settings to`, key_value);
        this.campaign_summary[index] = {...campaign, ...key_value};
      };
    });
  }

  @action setDateRange(start_timestamp, end_timestamp) {
    this.start_timestamp = start_timestamp;
    this.end_timestamp = end_timestamp;
  }

}


const campaignSummaryPaginationStore = new CampaignSummaryPaginationStore();

export default campaignSummaryPaginationStore;
