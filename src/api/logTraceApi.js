import axios from 'axios';
class LogTraceApi {
  fetchSummary(args) {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/log/trace/summary`, {
          params: args,
          headers: {'Accept': 'application/json'},
        })
        .then(res => {
          const result = res.data;
          console.log('campaign result',result)
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
          console.log(`fetch campaign summary finished`, args);
        });
    });
  }

  get() {
    return new Promise((resolve, reject) =>
    {
      axios.get(`/api/log/trace/summary`, {
          headers: {'Accept': 'application/json'},
          // transformResponse: undefined
        })
        .then(res => {
          const result = res.data;
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
          console.log(`fetch lander summary finished`);
        });
    });
  }

}


const logTraceApi = new LogTraceApi();

export default logTraceApi;
