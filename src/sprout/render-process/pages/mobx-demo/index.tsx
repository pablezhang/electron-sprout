import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';

@inject('demoStore')
@observer
export class Demo extends PureComponent<any, any> {
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
