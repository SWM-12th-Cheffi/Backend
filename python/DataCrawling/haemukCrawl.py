import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

Category_World_Data = ["한식 요리", "중식 요리", "일식 요리", "동남아/인도 요리", "멕시칸 요리", "양식 요리", "퓨전요리", "이국적인맛"]
Category_Ingred_Data = ["육류 요리", '채소류 요리', '해산물 요리', '콩/두부 요리', '과일 요리', '달걀/유제품 요리', '면/만두요리', '김치요리', '제철재료 요리', '가공식품 요리']
Category_Cooking_Data = ['밥요리', '면요리', '국물요리', '찜/조림/구이요리', '볶음/튀김/부침요리', '나물/샐러드요리', '김장/절임요리', '베이킹/디저트요리', '양념/소스/잼', '음료/차/커피']

client = MongoClient('172.17.0.3', 27017)
print(client.list_database_names())
mydb = client['haemukData'] # test table
#myIng = mydb['IngredData_Test'] # collection for Ingredient Data
myRec = mydb['RecipeData_Data'] # collection for Recipe Data
myCat = mydb['Category_Data']
n = 0
for i in range(5981, 1, -1):
    if n == 500:
        break
    Url = 'https://haemukja.com/recipes/'+str(i)
    r = requests.get(Url, allow_redirects=False)
    serverStatus = True if r.status_code == 200 else False
    if serverStatus:
        html = r.text
        soup = BeautifulSoup(html, 'html.parser')
        ingredient_data = soup.select('#container > div.inpage-recipe > div > div.view_recipe > section.sec_info > div > div.btm > ul > li > span')
        ingredient_list = list()
        for j in ingredient_data:
            eachIngredient = j.get_text()
            ingredient_list.append(eachIngredient)
#            result = myIng.update_one({"ingred": eachIngredient}, {"$inc": {"num": 1}}, upsert=True)
#            print(result)
        RecipeTitle = soup.select_one('#container > div.inpage-recipe > div > div.view_recipe > section.sec_info > div > div.top > h1 > strong').get_text()
        RecipeTime = soup.select_one('#container > div.inpage-recipe > div > div.view_recipe > section.sec_info > div > div.top > dl > dd:nth-child(2)').get_text()
        RecipeScrap = soup.select_one('#scrap-cnt').get_text()
        RecipeCalories = soup.select_one('#container > div.inpage-recipe > div > div.view_recipe > section.sec_info > div > div.top > dl > dd:nth-child(6)')
        Category_data = soup.select('#container > div.inpage-recipe > div > div.view_recipe > section.sec_detail > div.box_tag > a')
        Category_World = list()
        Category_Ingred = list()
        Category_Cooking = list()
        for j in Category_data:
            eachCategory = j.get_text()
            if eachCategory in Category_World_Data:
                Category_World.append(eachCategory)
            if eachCategory in Category_Ingred_Data:
                Category_Ingred.append(eachCategory)
            if eachCategory in Category_Cooking_Data:
                Category_Cooking.append(eachCategory)
            result = myCat.update_one({"ingred": eachCategory}, {"$inc": {"num": 1}}, upsert=True)
            print(result)
        print(Category_World)
        print(Category_Ingred)
        print(Category_Cooking)
        if RecipeCalories is not None:
            RecipeCalories = RecipeCalories.get_text()
            print("There is Calories Value")
            #print(ingredient_list)
            result = myRec.insert_one({"id": i, "title": RecipeTitle, "time": RecipeTime, "Scrap": RecipeScrap, "Calories": RecipeCalories, "Ingredient": ingredient_list, "Category_World": Category_World, "Category_Ingred": Category_Ingred, "Category_Cooking": Category_Cooking})
            print(result)
        else:
            print("No Calories")
            #print(ingredient_list)
            result = myRec.insert_one({"id": i, "title": RecipeTitle, "time": RecipeTime, "Scrap": RecipeScrap, "Calories": "Null", "Ingredient": ingredient_list, "Category_World": Category_World, "Category_Ingred": Category_Ingred, "Category_Cooking": Category_Cooking})
            print(result)
    
        n = n + 1
        print("--------------------" + str(n) + "---------------------")
    else:
        print("id: " + str(i) + " redirected")
print("——————————————finish———————————————")