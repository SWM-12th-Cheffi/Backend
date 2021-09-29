from neo4j import GraphDatabase
import csv
import json # import json module

# with statement
with open('/server/python/crawl/recipe10000_0929.json') as json_file:
    json_data = json.load(json_file)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)
ingrelist = set()
session = driver.session()
query = ""
for i in json_data['rec']:
  for j in i['renew']:
    ingrelist.add(j)
for i in ingrelist:
  query = "OPTIONAL MATCH (p:Ingredient{name: '" + i + "'}) WITH p WHERE p IS NULL Create (:Ingredient{name: '" + i + "'}) "
  result = session.run(query) # 재료 데이터를 입력함(관계 x)
  print(result)
session.close()
driver.close()