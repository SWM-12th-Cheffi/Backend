from neo4j import GraphDatabase
import csv

f = open('/server/python/crawl/r_id_i_name_match.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)

session = driver.session()
query = ""
for i in recipeList:
    query = "match (n:Recipe{id: '" + i[0] + "'}) match (r:Ingredient{name:'" + i[1] + "'}) create (n)<-[:USEDIN]-(r); "
    result = session.run(query)
    print(result)

session.close()
driver.close()

f.close()
