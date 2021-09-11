from neo4j import GraphDatabase
import csv
import json

f = open('/server/python/crawl/Recipe.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)

session = driver.session()
query = ""
j = 0
for i in recipeList:
    id = i[0].split('"id":')[-1][:4]
    query += "create (:Recipe{id: '" + id + "'}) "
    j += 1
    #create (n:Recipe{id: '1234', title: '맛있는 테이블', time: '30분', scrap: '252', calories: '847.3kcal'})
    if j == 100:
        result = session.run(query) # 재료 데이터를 입력함(관계 x)
        print(result)
        #print(query)
        j = 0
        query = ""
result = session.run(query) # 재료 데이터를 입력함(관계 x)
print(result)
session.close()
driver.close()

f.close()
