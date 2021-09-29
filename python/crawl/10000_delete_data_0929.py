from neo4j import GraphDatabase
import json # import json module

# with statement
with open('/server/python/crawl/recipe10000_0929.json') as json_file:
    json_data = json.load(json_file)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)
session = driver.session()
j = 0
for i in json_data['rec']:
  id = str(i['id']['id'])
  print(id)
  if  j > 50:
    break
  query = "match (r:Recipe{id: '" + id + "'})<-[i:USEDIN]-(d:Ingredient) delete i"
  print(session.run(query))
  j+= 1

print('fin')
session.close()
driver.close()
