from neo4j import GraphDatabase
import csv

f = open('/server/python/crawl/r_id_i_name_match.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)
b = ['5388','5389', '5390', '5391', '5392', '5393', '5394', '5395', '5396', '5397', '5398', '5399', '5400', '5401']
session = driver.session()
query = ""
for i in recipeList:
    if(i[0] in b):
        print(i[0])
        query = "match (n:Recipe{id: '" + i[0] + "'}) match (r:Ingredient{name:'" + i[1] + "'}) create (n)<-[:USEDIN]-(r); "
        result = session.run(query)
        print(result)

session.close()
driver.close()

f.close()
