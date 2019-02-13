import { observable, action, configure } from 'mobx';
configure({enforceActions: 'always'});

class UTCStore{
  @observable utc = 'utc+8';

  @action ChangeUTC(value){
    console.log('utc value--->',value)
    this.utc = value;
  }
}

const utcStore = new UTCStore();

export default utcStore;