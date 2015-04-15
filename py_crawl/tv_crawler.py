__author__ = 'matt'
import tmdb3
import json
import urllib

api_key = '3cc573875437af1d7fc733ee4b61892a'
imgdir = 'tv_crawl/img'
names_file = 'tv_crawl/tv_show_names'
shows_json = 'tv_crawl/data/shows.json'
seasons_json = 'tv_crawl/data/seasons.json'
episodes_json = 'tv_crawl/data/episodes.json'


def get_episode_data(episode):
    episode_data = {
        'id': episode.id,
        'series_id': episode.series_id,
        'season_number': episode.season_number,
        'episode_number': episode.episode_number,
        'name': episode.name,
        'summary': episode.overview,
        'imdb_rating': episode.userrating,
        'air_date': str(episode.air_date),
        'img_url': '',
    }

    if episode.still is not None:
        sizes = episode.still.sizes()
        size = sizes[1] if len(sizes) > 1 else sizes[0]
        episode_data['img_url'] = episode.still.geturl(size)
    return episode_data


def get_season_data(season):
    season_data = {
        'id': season.id,
        'name': season.name,
        'air_date': str(season.air_date),
        'series_id': season.series_id,
        'summary': season.overview,
        'episodes': []
    }

    episodes = []
    for id in season.episodes:
        season_data['episodes'].append(season.episodes[id].id)
        episodes.append(get_episode_data(season.episodes[id]))

    return season_data, episodes


def get_show_data(query):
    series = tmdb3.searchSeries(query)[0]
    show_data = {
        'id': series.id,
        'numSeasons': series.number_of_seasons,
        'numEps': series.number_of_episodes,
        'first_date': str(series.first_air_date),
        'last_date': str(series.last_air_date),
        'imdbId': series.imdb_id,
        'name': series.name,
        'imdbRating': series.userrating,
        'summary': series.overview,
        'networks': [],
        'genres': [],
        'keywords': [],
        'cast': [],
        'seasons': []
    }

    for network in series.networks:
        show_data['networks'].append(network.name)

    for genre in series.genres:
        show_data['genres'].append(genre.name)

    for keyword in series.keywords:
        show_data['keywords'].append(keyword.name)

    for person in series.cast:
        show_data['cast'].append(person.name)

    if series.poster is not None:
        sizes = series.poster.sizes()
        size = sizes[4] if len(sizes) > 4 else sizes[len(sizes)-1]
        url = series.poster.geturl(size)
        show_data['remote_img_url'] = url
        show_data['img_filename'] = url[url.rindex('/')+1:]

    seasons = []
    episodes = []
    for season in series.seasons:
        (season_data, season_episodes) = get_season_data(series.seasons[season])
        show_data['seasons'].append(series.seasons[season].id)
        season_data['season_number'] = season
        seasons.append(season_data)
        episodes.extend(season_episodes)

    return show_data, seasons, episodes


def get_all_shows():
    tmdb3.set_key(api_key)
    tmdb3.set_cache('null')
    tmdb3.set_cache(filename='/full/path/to/cache') # the 'file' engine is assumed
    tmdb3.set_cache(filename='tmdb3.cache')         # relative paths are put in /tmp
    tmdb3.set_cache(engine='file', filename='~/.tmdb3cache')
    with open(names_file) as f:
        content = f.readlines()
    show_img_urls = []
    for raw in content:
        show_name = raw.replace("\n", "")
        print show_name
        (show, show_seasons, show_episodes) = get_show_data(show_name)
        with open(shows_json, 'a') as show_file:
            json.dump(show, show_file, sort_keys=True, indent=4, separators=(',', ': '))
            show_file.writelines(",\n")
        with open(seasons_json, 'a') as season_file:
            for show_season in show_seasons:
                json.dump(show_season, season_file, sort_keys=True, indent=4, separators=(',', ': '))
                season_file.writelines(",\n")
        with open(episodes_json, 'a') as episode_file:
            for show_episode in show_episodes:
                json.dump(show_episode, episode_file, sort_keys=True, indent=4, separators=(',', ': '))
                episode_file.writelines(",\n")

        show_seasons = None
        show_episodes = None
        show_img_urls.append((show['name'], show['remote_img_url'], show['img_filename']))

    return show_img_urls

print 'Starting Data Crawl...'
with open(shows_json, 'w') as show_file:
    show_file.writelines("[\n")
with open(seasons_json, 'w') as show_file:
    show_file.writelines("[\n")
with open(episodes_json, 'w') as show_file:
    show_file.writelines("[\n")

show_imgs = get_all_shows()

with open(shows_json, 'a') as show_file:
    show_file.writelines("]")
with open(seasons_json, 'a') as show_file:
    show_file.writelines("]")
with open(episodes_json, 'a') as show_file:
    show_file.writelines("]")

print "\nDownloading Images..."
for (name, img_url, img_filename) in show_imgs:
    imgpath = imgdir + '/' + img_filename
    print name + '... ' + img_url + ' -> ' + imgpath

    urllib.urlretrieve(img_url, imgpath)