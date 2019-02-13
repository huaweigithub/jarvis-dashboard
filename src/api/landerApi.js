import axios from 'axios';


class LanderApi {

  constructor() {
    this.cache_limit = 15;
    this.lander_id_buffer = [];
    this.id_to_lander = {};
  }

  cacheLander(lander) {
    const lander_id = lander_id;
    this.lander_id_buffer.push(lander_id);
    if(this.lander_id_buffer.length > this.cache_limit) {
      const to_remove_id = this.lander_id_buffer.shift();
      delete this.id_to_lander[to_remove_id];
    };

    this.id_to_lander[lander_id] = lander;
  }


  getStats(args) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/lander/_stats`, {
          params: args,
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          console.log('lander result---',result)
          resolve(result);
          result['landers'].map((lander_stats, _index) => {
            let lander = {...lander_stats};
            delete lander['visit'];
            delete lander['click'];
            this.cacheLander(lander);
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
          console.log(`fetch lander stats finished`, args);
        });
    });
  }

  get(id) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/lander/${id}`, {
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
          this.cacheLander(result);
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
          console.log(`fetch lander ${id} summary finished`);
        });
    });
  }

  post(lander) {
    return new Promise((resolve, reject) =>
    {
      axios.post(`/api/lander`,JSON.stringify(lander), {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          const result = res.data;
          this.cacheLander(result);
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
      axios.post(`/api/lander/${id}`, JSON.stringify(args), {
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
          this.cacheLander(result);
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
          console.log(`patch lander summary finished`, args);
        });
    });
  }

  getAll(){
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/lander`,{
        headers:{'Accept': 'application/json'},
      })
        .then(res => {
          const result = res.data;
          resolve(result);
          result.map((lander) => {this.cacheLander(lander)});
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
          console.log(`fetch landers finished`);
        })
    })
  }
}


const landerApi = new LanderApi();

export default landerApi;
