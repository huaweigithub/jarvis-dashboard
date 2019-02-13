import axios from 'axios';


class OfferApi {

  constructor() {
    this.cache_limit = 15;
    this.offer_id_buffer = [];
    this.id_to_offer = {};
  }

  cacheOffer(offer) {
    const offer_id = offer_id;
    this.offer_id_buffer.push(offer_id);
    if(this.offer_id_buffer.length > this.cache_limit) {
      const to_remove_id = this.offer_id_buffer.shift();
      delete this.id_to_offer[to_remove_id];
    };

    this.id_to_offer[offer_id] = offer;
  }


  getStats(args) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/offer/_stats`, {
          params: args,
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          console.log("offer result",result)
          resolve(result);
          result['offers'].map((offer_stats, _index) => {
            let offer = {...offer_stats};
            delete offer['visit'];
            delete offer['click'];
            this.cacheOffer(offer);
          });
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

  getSearch(args) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/offer/_stats`, {
          params: args,
          headers: {'Accept': 'application/json'},
        })
        .then(res => {
          const result = res.data;
          console.log('offer result',result)
          return resolve(result);
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

  get(id) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/offer/${id}`, {
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          this.cacheOffer(result);
          return resolve(result);
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
          console.log(`fetch offer ${id} summary finished`);
        });
    });
  }

  post(offer) {
    return new Promise((resolve, reject) =>
    {
      axios.post(`/api/offer`,JSON.stringify(offer), {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          const result = res.data;
          this.cacheOffer(result);
          return resolve(result);
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
          console.log('post error to', error);
          return reject({'friendly': friendly, 'message': error});
        })
        .then(() => {
          console.log(`fetch lander summary finished`);
        });
    });
  }

  patch(id, args) {
    return new Promise((resolve, reject) =>
    {
      axios.post(`/api/offer/${id}`, JSON.stringify(args), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-HTTP-Method-Override': 'PATCH',
          },
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          resolve(result);
          this.cacheOffer(result);
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
          console.log(`patch offer summary finished`, args);
        });
    });
  }

  getAll(){
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/offer`,{
        headers:{'Accept': 'application/json'},
      })
        .then(res => {
          const result = res.data;
          resolve(result);
          result.map((offer) => {this.cacheOffer(offer)});
        })
        .catch(res => {
          let error = '未知错误';
          let friendly = true;
          if(res.response){
            const result = res.response.data;
            error = (result && result.message) || error;
            friendly = result && result.message ? true : false;
          }else{
            friendly = false;
            error = res.message;
          };
          return reject({'friendly': friendly, 'message': error});
        })
        .then(()=>{
          console.log(`get offers finished`);
        })
    })
  }
}


const offerApi = new OfferApi();

export default offerApi;
