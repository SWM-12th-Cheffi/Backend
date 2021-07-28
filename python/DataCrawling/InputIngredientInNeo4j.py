from neo4j import GraphDatabase
import csv

f = open('IngredResult2.csv', 'r', encoding='utf-8')
ingredList = csv.reader(f)

neoAuth = ("neo4j","s3cr3t") # ID, PW
driver = GraphDatabase.driver("bolt://172.17.0.2:7687", auth=neoAuth)

session = driver.session()
for i in ingredList:
    result = session.run("create (n:Ingredient{name: '" + i[0] + "'})") # 재료 데이터를 입력함(관계 x)
    print(result)

session.close()
driver.close()


f.close()