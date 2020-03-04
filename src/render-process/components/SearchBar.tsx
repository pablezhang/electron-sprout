import React, { Component } from 'react';
import SeachContent from './SearchContent';

export default class SearchBar extends Component<any, any>{
  constructor(props: any) {
    super(props);
  }

  _onSubmit(e) {
    e.preventDefault();
    this.props.push(SeachContent);
// @ts-ignore
    this.props.search(this.refs.search.value);
  }

  render() {
    // let SearchIcon = require("../assets/icon/search.svg");
    return (
      <section
        style={{
          // WebkitAppRegion: 'no-drag',
        }}
        className="header__searchbar"
        >
        <form id="search-form" onSubmit={e => this._onSubmit(e)}
        >
          <label htmlFor="search">
            {/*<SearchIcon className="i" />*/}
          </label>
          <input type="text" id="search" placeholder="搜索音乐" ref="search" />
          <input type="submit" hidden />
        </form>
      </section>
    );
  }
}
