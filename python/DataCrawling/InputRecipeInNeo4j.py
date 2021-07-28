from neo4j import GraphDatabase
import csv

f = open('RecipeResult2.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

neoAuth = ("neo4j","s3cr3t") # ID, PW
driver = GraphDatabase.driver("bolt://172.17.0.2:7687", auth=neoAuth)

session = driver.session()
for i in recipeList:
    title = i[1].replace("'", "")
    #create (n:Recipe{id: '1234', title: '맛있는 테이블', time: '30분', scrap: '252', calories: '847.3kcal'})
    result = session.run("create (n:Recipe{id: '" + i[0] + "', title: '" + title + "', time: '" + i[2] + "', scrap: '" + i[3] + "', calories: '" + i[4] + "'})") # 재료 데이터를 입력함(관계 x)
    print(result)

session.close()
driver.close()


f.close()