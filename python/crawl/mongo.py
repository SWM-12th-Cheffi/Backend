import csv
from pymongo import MongoClient

f = open('/server/python/crawl/Recipe.csv', 'r', encoding='utf-8')
recipeList = csv.reader(f)

client = MongoClient('18.220.121.204', 27017)
print(client.list_database_names())
mydb = client['recipe'] # table
myCol = mydb['haemuk'] # collection for Recipe Data

#{"scrap":1288,"time":25분,"calories":342.0 kcal,"id":5401,"title":돈까스덮밥}
a = []
for i in recipeList:
  scrap = i[0]
  time = i[1]
  kcal = i[2]
  id = i[3]
  title = i[4]
  a.append(title)
  print(a)
#  print(id)
#  res = myCol.find_one({"_id": id})
#  if(res == None):
#    result = myCol.insert_one({"_id": id, "title": title, "scrap": scrap, "time": time, "kcal": kcal})
#    print(result)
