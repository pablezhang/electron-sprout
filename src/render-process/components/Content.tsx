import React, { Component } from 'react';
import SearchContent from './SearchContent';
import HomeContent from './HomeContent';
import SideBar from './SideBar';
import Player from './Player';

export default class Content extends Component<any, any>{
  constructor(props: any) {
    super(props);
  }

  renderContent() {
    const { router } = this.props;
    return (
      <div className="main-content">
        {
          router.routerStack.map( (component, index) => {
            let Component = component;
            if (index == router.routerStack.length - 1) {
              return (<Component {...this.props} key={index} />)
            } else {
              return (<Component display='none' {...this.props} key={index} />)
            }
          })
        } 
      </div>
    )
  }

  render() {
    return (
      <div id="content">
        <SideBar {...this.props} />
        <div className="main-content">
          {this.renderContent()} 
        </div>
        <Player {...this.props} />
      </div>
    );
  }
}
