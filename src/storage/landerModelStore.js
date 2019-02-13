import { observable, action, configure } from 'mobx';

import landerApi from 'Api/landerApi';


configure({enforceActions: 'always'});


class LanderModelStore {

  @observable open=false;
  @observable lander=null;
  @observable loaded=false;
  @observable error=null;

  @observable submitting=false;
  @observable submit_error=null;
  @observable successSub=false;

  @action fetchLander(id, open = undefined) {
    if(open !== undefined) {
      this.open = open;
    };
    landerApi.get(id)
      .then(lander => {
        this.setLander(lander);
      })
      .catch(result => {
        this.setLoadFailed(result);
      });
  }

  @action setLander(lander) {
    this.lander = lander;
    this.error = null;
    this.loaded = true;
  }

  @action setLoadFailed({friendly, message}) {
    this.landers = null;
    this.error = friendly? message: `未知错误(${message})`;
    this.loaded = true;
  }

  @action openModal() {
    this.open = true;
  }

  @action closeModal() {
    this.open = false;
    this.lander = null;
    this.loaded = false;
  }

  @action openSweet(){
    this.successSub=true
  }

  @action closeSweet(){
    this.successSub=false
  }

  @action updateLanderField(key, value) {
    this.lander[key] = value;
  }

  @action updateSubmitStatus(args) {
    for (var key in args) {
      this[key] = args[key];
    };
  }

}


const landerModelStore = new LanderModelStore();

export default landerModelStore;
