from neo4j import GraphDatabase
import json # import json module

# with statement
with open('/server/python/crawl/recipe10000_0929.json') as json_file:
    json_data = json.load(json_file)
query = ""
neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)
session = driver.session()
length = len(json_data['rec'])
j = 0
k = 0
ingredlist = []
ingreddict = dict()
m = 0
for i in json_data['rec']:
    j += 1
    ingredlist.append(i['renew']) # 레시피 재료
    for l in i['renew']: # 레시피마다 인덱스 붙이기
        if l not in ingreddict:
            ingreddict[l] = m
            m += 1
    query += "match (r" + str(j-1) + ":Recipe{id: '" + i['id']['id'] + "'}) with " +','.join(list(map(lambda x: "r" + str(x) + " ", [b for b in range(j)])))
    print(str(length-(j + 10 * k)) + '/' + str(length))
    if j == 10:
        for l, v in ingreddict.items():
            query += "match (i" + str(v) + ":Ingredient{name: '" + l + "'}) with " + ','.join(list(map(lambda x: "r" + str(x) + " ", [b for b in range(j)]))) + ',' + ','.join(list(map(lambda x: "i" + str(x) + " ", [b for b in range(v+1)])))
        query += " create "
        for a, n in enumerate(ingredlist):
            for b in n:
                query += "((r" + str(a) + ")<-[:USEDIN]-(i" + str(ingreddict[b])+ ")), "
        #print(query[:-2])
        #print(session.run(query[:-2]))
        query = ""
        ingredlist = []
        ingreddict = dict()
        j = 0
        k += 1
        m = 0
if query != "":
    for l, v in ingreddict.items():
        query += "match (i" + str(v) + ":Ingredient{name: '" + l + "'}) with " + ','.join(list(map(lambda x: "r" + str(x) + " ", [b for b in range(j)]))) + ',' + ','.join(list(map(lambda x: "i" + str(x) + " ", [b for b in range(v+1)])))
    query += " create "
    for a, n in enumerate(ingredlist):
        for b in n:
            query += "((r" + str(a) + ")<-[:USEDIN]-(i" + str(ingreddict[b])+ ")), "
    #print(query[:-2])
    print(session.run(query[:-2]))
print('fin')
session.close()
driver.close()
