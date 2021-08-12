# -*- coding: utf-8 -*-
import re
import pandas as pd
import numpy as np
import csv
import json
from sklearn.feature_extraction.text import CountVectorizer
count_vector = CountVectorizer(ngram_range=(1,3))

ableIngre = []
RecipeVector = []
Recipe_cate_ingre_vector = []

from scipy import spatial
# input two vector arrays
import re

def dfmaking():
    file = "Id2Recipe.csv"
    file_match = "Recipecategories.csv"
    Id = []
    Recipe = []
    with open(file,'r') as f:
        lines = f.readlines()
        for line in lines:
            Id.append(line.split('\t')[0])
            Recipe.append(line.split('\t')[1].strip('\n'))
    Category1 = []
    Category2 = []
    with open(file_match,'r') as f:
        lines = f.readlines()
        for line in lines:
            Category1.append(line.split('\t')[1])
            Category2.append(line.split('\t')[2].strip('\n'))
    df = pd.DataFrame({"id":Id,"recipe":Recipe,"from":Category1, "what":Category2})
    df['result'] = df['what'].apply(lambda x : [item for item in x.split(',')]).apply(lambda y: " ".join(y).strip("[").strip("]").strip("\""))
    df['result'] = df['result'].apply(lambda x : x.strip("\“").strip("\”").strip("\"").strip("\”").strip("\"").strip("\” “"))
    df['result'] = df['result'].apply(lambda x : x.replace("요리","").replace(" ”","").replace(" “","").replace("”","").replace("“",""))
    df['result'] = df['result'].apply(lambda x : x.replace(" \" \""," ").replace("\" \""," ").replace(" \"","").replace(",","").replace("” “"," "))
    size = len(df)
    df['from'] = df['from'].apply(lambda x : x.strip('[').strip(']').replace("요리","").replace(" ”","").replace(" “","").replace("”","").replace("“","").replace(" ,","").replace(",",""))
    df['from'] = df['from'].apply(lambda x : x.replace(" \" \""," ").replace("\" \""," ").replace(" \"","").replace(","," ").replace("” “"," ").replace("\""," "))
    for i in range(size):
        df['result'][i] = str(df['result'][i]) + str(df['from'][i])
        
    return df


def calculate_similarity_vectors(vector1, vector2): 
    return 1 - spatial.distance.cosine(vector1.tolist(), vector2.tolist())


def generateUserPreferenceVector(df,preferenceJSON):
    likeList = preferenceJSON['like']
    likeList = list(filter(lambda x : x!= None,likeList))
    vector = np.zeros(661)
    df1 =  df[df["recipe"].isin(likeList)]
    size = len(df1)
    for i in range(size):
        vector += df1.iloc[i]['vector']
    return vector



def import_vector_ingre():
    with open("vector_ingre1.csv","r") as f:
        ingre_vector = []
        ingre_vectori = []
        a = f.readlines()
    size = len(a)
    for i in range(size-1):
        ingre_vectori.append(a[i])
        if a[i+1][0] == '_':
            ingre_vector.append(ingre_vectori)
            ingre_vectori = []
        elif i+1 == size-1:
            ingre_vectori.append(a[i+1])

    ingre_vector.append(ingre_vectori)
    ingre_Vector = {}
    for item in ingre_vector:
        r = ""
        for row in item:
            if row[0] == "_":
                r +=  item[0].split(":")[1].strip('[')
            else:
                r += row
        r = list(map(lambda x : float(x),r.strip().replace("]","").split()))
        ingre_Vector[str("".join(re.compile("[가-힣]").findall(item[0])))] = r
    return ingre_Vector



def calculate_vector_Recipe(df):
    ingre_Vector = import_vector_ingre()
    
    f = open('my_new_csv551.csv', 'r', encoding='utf-8')
    recipeList = csv.reader(f)
    l = []
    for i in recipeList:
        li = i[5].strip('[').strip(']')
        l.append(li.split(","))
    res = []
    for i in l:
        small = []
        for j in i:
            small.append(j.replace('"', ''))
        res.append(small)
    #ableIngre = []
    #RecipeVector = []
    
    
    
    category_vector = count_vector.fit_transform(df['result'])
    for ingrelist in res:
        RecipeVector_i = np.zeros(50)
        for item in ingrelist:
            if item in ingre_Vector.keys():
                ableIngre.append(item)
                RecipeVector_i += np.array(ingre_Vector[item])
        RecipeVector.append(RecipeVector_i)
    #Recipe_cate_ingre_vector = []
    length = len(df)
    for i in range(length):
        Recipe_cate_ingre_vector.append(category_vector[i].toarray().tolist()[0]+RecipeVector[i].tolist())
    df['vector'] = pd.DataFrame([np.array(Recipe_cate_ingre_vector[i])] for i in range(length))
    return df

def get_recommend_by_userVector(df, possible_recipe_id_list, top=20,JSON = {"like":["짜장면","짬뽕"]}):
    df1 = df[df['id'].isin(list(map(lambda x: str(x),possible_recipe_id_list)))]
    vector = generateUserPreferenceVector(df,JSON)
    df1['similarity'] = df1['vector'].apply(lambda x : calculate_similarity_vectors(vector, x))
    df1 = df1.sort_values(by='similarity',ascending=False)
    #return df1[:top]
    size = len(df1)
    retId =  []
    for i in range(size):
        retId.append(df1.iloc[i].id)
    return json.dumps({"id":retId})
df = calculate_vector_Recipe(dfmaking()) # preprocessing
#print(get_recommend_by_userVector(df, np.array(Recipe_cate_ingre_vector[373]) , [0,1,2,3,4,5,100],top=20).id) #input = instead of np.array(...), userVector 
print(get_recommend_by_userVector(df,  [5394,5657,5797,5842,5406],top=20))

