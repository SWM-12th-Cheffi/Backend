import requests
from bs4 import BeautifulSoup
import urllib.request

for i in range(1, 100):
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
    else:
        print("id: " + str(i) + " redirected")
print("——————————————finish———————————————")
