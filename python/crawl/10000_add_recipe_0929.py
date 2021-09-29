from neo4j import GraphDatabase
import json # import json module

# with statement
with open('/server/python/crawl/recipe10000_0929.json') as json_file:
    json_data = json.load(json_file)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)
session = driver.session()
query = ""
length = len(json_data['rec'])
j = 0
k = 0
for i in json_data['rec']:
  j +=1
  print(str(length-(j + 100 * k)) + '/' + str(length))
  query += "Create (:Recipe{id: '" + i['id']['id'] + "', platform: '10000'}) "
  if j ==100:
    result = session.run(query) # 재료 데이터를 입력함(관계 x)
    print(result)
    j = 0
    k += 1
    query = ""
if query != "":
    result = session.run(query) # 재료 데이터를 입력함(관계 x)
    print(result)
print('fin')
session.close()
driver.close()