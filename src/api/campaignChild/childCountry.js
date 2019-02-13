import axios from 'axios';


class ChildCountry {

  constructor() {
    this.cache_limit = 15;
    this.campaign_id_buffer = [];
    this.id_to_campaign = {};
  }

  cacheCampaign(campaign) {
    const campaign_id = campaign_id;
    this.campaign_id_buffer.push(campaign_id);
    if(this.campaign_id_buffer.length > this.cache_limit) {
      const to_remove_id = this.campaign_id_buffer.shift();
      delete this.id_to_campaign[to_remove_id];
    };

    this.id_to_campaign[campaign_id] = campaign;
  }

  getStats(args,id) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/campaign/${id}/location/country/_stats`, {
          params: args,
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          resolve(result);
        })
        .catch(res => {
          let error = '未知错误';
          let friendly = true;
          if (res.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const result = res.response.data;
            error = (result && result.message) || error;
            friendly = result && result.message? true: false;
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', res);
            friendly = false;
            error = res.message;
          };
          console.log('set error to', error);
          return reject({'friendly': friendly, 'message': error});
        })
        .then(() => {
          console.log(`fetch offer stats finished`, args);
        });
    });
  }

}


const childCountry = new ChildCountry();

export default childCountry;
