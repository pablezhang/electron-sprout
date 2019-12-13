import * as React from 'react';
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { WindowsService } from 'sprout/services/windows/electron-render/windowsService';
import { autowired } from 'sprout/windows/main-window/index';

console.log('injectInstance:', autowired);
console.log('WindowsService:', WindowsService);
@inject('demoStore')
@observer
export class Demo extends Component<any, any> {

  @autowired(WindowsService)
  private windowService: WindowsService;

  constructor(props) {
    super(props);
    this.windowService.reloadWindow(1);
  }
  render() {
    return (
      <div>
        Demo-cc:
        {this.props.demoStore.cc}
        <button onClick={this.props.demoStore.changeCount}>改变count</button>
        <br/>
        Demo-bb:
        {this.props.demoStore.bb}
        <button onClick={this.props.demoStore.changeTest}>改变Test</button>
      </div>
    );
  }
}
