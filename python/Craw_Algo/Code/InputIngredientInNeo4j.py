from neo4j import GraphDatabase
import csv

f = open('/Users/dongsikga/Code/Cheffi/cheffi_backend/python/DataCrawling/IngredResult2.csv', 'r', encoding='utf-8')
ingredList = csv.reader(f)
neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)

session = driver.session()
for i in ingredList:
    result = session.run("create (n:Ingredient{name: '" + i[0] + "'})") # 재료 데이터를 입력함(관계 x)
    print(result)

session.close()
driver.close()


f.close()