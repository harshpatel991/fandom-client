__author__ = 'matt'

shows = set()

# Popular parse
f = open('imdb_popular_raw')
for i in range(25):
    name = f.readline()
    start = name.index('.')+1
    end = name.index('(')
    f.readline()
    f.readline()
    f.readline()
    f.readline()
    shows.add(name[start:end].strip())

# Top parse
f = open('imdb_top_raw')
for i in range(50):
    name = f.readline()
    start = name.index('.')+1
    end = name.index('(')
    f.readline()
    f.readline()
    f.readline()
    f.readline()
    shows.add(name[start:end].strip())

shows.remove('SKIP')
shows = sorted(list(shows)[:50])
fo = open('tv_show_names', 'w')
for name in shows:
    fo.writelines(name+'\n')