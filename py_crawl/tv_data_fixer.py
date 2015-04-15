__author__ = 'matt'
# DO NOT RUN AGAIN!!!!!! IT WILL BREAK THINGS!!!!!
#fixed image filenames
import tmdb3
import json
import urllib

imgdir = 'img'
shows_json_in = 'data/shows.json'
shows_json_out = 'data/shows2.json'


def get_shows():
    with open(shows_json_in, 'r') as f:
        shows = json.load(f)
        f.close()
    return shows

shows = get_shows()
for show in shows:
    url = show['remote_img_url']
    filename = show['name'].lower().replace(" ", "_").replace(":", "_").replace(".", "").replace("'", "")
    file_ext = url[url.rindex("."):]
    filename += file_ext
    show['img_filename'] = filename
    filepath = imgdir + '/' + filename
    #print show['name'] + '... ' + url + ' -> ' + filepath
    #urllib.urlretrieve(url, filepath)

print(json.dumps(shows, sort_keys=True, indent=4, separators=(',', ': ')))
#with open(shows_json_out, 'w') as fout:
    #json.dump(fout, shows, sort_keys=True, indent=4, separators=(',', ': '))