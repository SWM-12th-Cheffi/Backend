import requests
from bs4 import BeautifulSoup
import urllib.request
from pymongo import MongoClient

client = MongoClient('172.17.0.3', 27017)
print(client.list_database_names())
mydb = client['ImageData'] # test table
#myIng = mydb['IngredData_Test'] # collection for Ingredient Data
myCol = mydb['haemuk'] # collection for Recipe Data

for i in range(1, 101):
    Url = 'https://haemukja.com/recipes?page=' + str(i)
    r = requests.get(Url, allow_redirects=False)
    serverStatus = True if r.status_code == 200 else False
    if serverStatus:
        html = r.text
        soup = BeautifulSoup(html, 'html.parser')
        image_Data = soup.select('#content > section > div.recipes > div > ul > li')
        for j in image_Data:
            imageID = j.find('a')['href'].split('/')[2]
            urllib.request.urlretrieve(j.find('a').find('img')['src'], "../../../image/haemuk/"+j.find('a')['href'].split('/')[2]+".jpg")
            result = myCol.insert_one({"id": imageID})
#            print(result)
    else:
        print("id: " + str(i) + " redirected")
print("——————————————finish———————————————")
