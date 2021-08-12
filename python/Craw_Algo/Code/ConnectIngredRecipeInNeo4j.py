from neo4j import GraphDatabase
import csv

f = open('/Users/dongsikga/Code/Cheffi/cheffi_backend/python/DataCrawling/RecipeResult2.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)

session = driver.session()
for i in recipeList:
    ingred = list(i[5][1:-1].replace('"', '').split(","))
    for j in ingred:
        # match (n:Recipe{id:"5980"}), (m:Ingredient{name:"단호박"}) CREATE (n)<-[r:USEDIN]-(m)
        result = session.run("match (n:Recipe{id:'" + i[0] + "'}), (m:Ingredient{name:'" + j + "'}) CREATE (n)<-[r:USEDIN]-(m)") # 관계를 연결함
        print(result)
    print(i[0] + "finished")

session.close()
driver.close()


f.close()