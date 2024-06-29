import { useEffect } from 'react';
import s from "./style.module.css";
import { TVShowAPI } from "./api/tv-show";
import { useState } from "react";
import { BACKDROP_BASE_URL } from "./config";
import { TVShowDetail } from './components/TVShowDetail/TVShowDetail';
import { Logo } from './components/Logo/Logo';
import logoImg from "./assets/images/logo.png";
import { TVShowListItem } from './components/TVShowListItem/TVShowListItem';
import { TvShowList } from './components/TvShowList/TvShowList';
import { SearchBar } from './components/SearchBar/SearchBar';
export function App() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendationList, setRecommendationList] = useState([]);

  async function fetchPopulars() {
    const popularTVshowList = await TVShowAPI.fetchPopulars();
    if (popularTVshowList.length > 0) {
      setCurrentTVShow(popularTVshowList[0]);
    }
  }

  async function fetchRecommendations(tvShowId) {
    const recommendationListResp = await TVShowAPI.fetchRecommendations(tvShowId);
    if (recommendationListResp.length > 0) {
      setRecommendationList(recommendationListResp.slice(0, 10));
    }
  }

  async function fetchByTitle(title) {
    const searchResponse = await TVShowAPI.fetchByTitle(title);
    if (searchResponse.length > 0) {
      setCurrentTVShow(searchResponse[0]);
    }
  }

  useEffect(() => {
    fetchPopulars();
  }, []);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendations(currentTVShow.id);
    }
  }, [currentTVShow]);

  function updateCurrentTvShow(tvShow) {
    setCurrentTVShow(tvShow)
  }

  return <div className={s.main_container} style={{
    background: currentTVShow
      ? `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
         url("${BACKDROP_BASE_URL}${currentTVShow.backdrop_path}") no-repeat center / cover`
      : "black",
  }}>
    <div className={s.header}>
      <div className="row">
        <div className="col-4">
          <Logo img={logoImg} title="Watowatch" subtitle="Find a show you may like" />
        </div>
        <div className="col-md-12 col-lg-4">
          <SearchBar onSubmit={fetchByTitle} />
        </div>
      </div>
    </div>
    <div className={s.tv_show_detail}>{currentTVShow && <TVShowDetail tvShow={currentTVShow} />}</div>
    <div className={s.recommended_tv_shows}>{currentTVShow && <TvShowList onClickItem={updateCurrentTvShow} tvShowList={recommendationList} />}</div>
  </div>
}