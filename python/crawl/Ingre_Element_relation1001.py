from neo4j import GraphDatabase
import csv
import json # import json module

# with statement
with open('/server/python/crawl/mapping.json') as json_file:
    ingrelist = json.load(json_file)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)
session = driver.session()
ingredict = {}
for i in ingrelist:
  for j in ingrelist[i]:
    if(type(ingrelist[i][j]) == type([])):
      ingredict[j] = ingrelist[i][j]
    else:
      for k in ingrelist[i][j]:
        ingredict[k] = ingrelist[i][j][k]
query = ""
for i in ingredict.keys():
  m = 0
  query += "match (I: Input{name: '" + i + "'}) with I "
  for j in ingredict[i]:
    query += "match (I" + str(m) + ":Ingredient{name: '" + j + "'}) with I, " + ','.join(list(map(lambda x: "I" + str(x) + " ", [b for b in range(m+1)])))
    m += 1
  for k in range(m):
    query += " create (I)-[:ELEMENT]->(I" + str(k) + ")"
  result = session.run(query) # 재료 데이터를 입력함(관계 x)
  print(result)
  query = ""

session.close()
driver.close()