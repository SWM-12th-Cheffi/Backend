from neo4j import GraphDatabase
import csv

f = open('/server/python/crawl/ingreSimilaringre.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

neoAuth = ("neo4j","r6qEpV4t") # ID, PW
#driver = GraphDatabase.driver("bolt://18.220.121.204:7687", auth=neoAuth)

#session = driver.session()
for i in recipeList:
    print("match (m:Ingredient{name: '" + i[0].split(':')[-1].split('}')[0] + "'}), (n:Ingredient{name:'" + i[1].split(':')[-1].split('}')[0] + "'}) create m-[:SIMILAR]->n")
    #create (n:Recipe{id: '1234', title: '맛있는 테이블', time: '30분', scrap: '252', calories: '847.3kcal'})
    #result = session.run("create (:Recipe{id: '" + i[0] + "'}) <-[:USEDIN]-(:Ingredient{name:'" + i[1] + "'})") # 재료 데이터를 입력함(관계 x)
    #print(result)

#session.close()
#driver.close()

f.close()
