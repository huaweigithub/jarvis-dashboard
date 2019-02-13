import axios from 'axios';


class lastChildLander {

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

  get(id) {
    return new Promise((resolve, reject) =>
    {
      const cached_campain = this.id_to_campaign[id];
      if(cached_campain) {
        return resolve(cached_campain);
      };

      axios.get(`/api/campaign/${id}/lander/_stats`, {
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          resolve(result);
          this.cacheCampaign(result);
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
          console.log(`fetch campaign ${id} summary finished`);
        });
    });
  }

  getStats(args,campaign_id,path_id) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/campaign/${campaign_id}/path/${path_id}/lander/_stats`, {
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


const lastchildLander = new lastChildLander();

export default lastchildLander;
