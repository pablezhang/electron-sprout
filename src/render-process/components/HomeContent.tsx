import React, { Component } from 'react';
import { recommendResource,recommendSongs } from '../server';
import Spinner from './Spinner';
import MiniAlbumCard from './MiniAlbumCard';
import SongList from './SongList';

export default class HomeContent extends Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      recommendState: 'nouser',
      recommend: null,
      songState: 'nouser',
      songs: null,
    }
  }

  componentWillReceiveProps(props) {
    if (props.user == this.props.user) {
      return;
    }
    if (props.user.loginState == 'logged_in') {
      this.setState({
        recommendState: 'fetching',
        songState: 'fetching',
      });
      recommendResource().then(res => {
        this.setState({
          recommendState: 'get',
          // @ts-ignore
          recommend: res.recommend,
        });
        console.log('REEE', res);
      });
      recommendSongs().then(res => {
        this.setState({
          songState: 'get',
          // @ts-ignore
          songs: res.recommend,
        });
        console.log('REEE', res);
      });
    } else {
      this.setState({
        recommendState: 'nouser',
      });
    }
  }

  render() {
    return (
      <div
        style={{
          display: this.props.display ? this.props.display : null,
        }} 
        className="content" id="home-content">
        <div className="content__main">
          <section className="recommend">
            <div className="content__headinfo">
              <p>个性化推荐</p>
            </div>
              {
                this.state.recommendState=='fetching' ? <Spinner /> :
                this.state.recommendState=='get' ? 
                (<div className="recommend__main">
                  {
                    this.state.recommend.map( (songlist, index) => 
                      <MiniAlbumCard
                        data={songlist} 
                        push={this.props.actions.push}
                        key={index}
                        fetchsonglistdetail={this.props.actions.fetchsonglistdetail}
                        />                                     
                    )
                  }
                 </div>) :
                (<div className="recommend__main">
                 </div>)
              }
          </section>
          <div className="content__main__list">
            {
              this.state.songState=='get' ?
                (<SongList
                    data={this.state.songs}
                    changeSong={this.props.actions.changeSong}
                    addSong={this.props.actions.addSong}
                    />) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
