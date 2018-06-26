''' csdn spider '''

import requests
from bs4 import BeautifulSoup

def start():
    ''' start def '''
    strat_url = 'http://blog.csdn.net/sirm2z'
    list_url2 = 'https://blog.csdn.net/sirm2z/article/list/2'
    list_url3 = 'https://blog.csdn.net/sirm2z/article/list/3'
    start_views = 0
    end_views = 0
    success_num = 0
    err_num = 0
    response = requests.get(strat_url, timeout=5)
    soup = BeautifulSoup(response.content, "html5lib")
    # start_views = soup.find("div", class_='.grade-box').string
    start_views = soup.select("div.grade-box dl:nth-of-type(2) dd")[0]['title']
    print('当前访问量：%s' % start_views)
    print('---------------------------------------')
    list_li1 = soup.find_all('div', class_='article-item-box')
    list_re2 = requests.get(list_url2, timeout=5)
    list_soup2 = BeautifulSoup(list_re2.content, "html5lib")
    list_li2 = list_soup2.find_all('div', class_='article-item-box')
    list_re3 = requests.get(list_url3, timeout=5)
    list_soup3 = BeautifulSoup(list_re3.content, "html5lib")
    list_li3 = list_soup3.find_all('div', class_='article-item-box')
    for item in list_li1:
        url = item.find('h4').find('a').attrs['href']
        item_re = requests.get(url, timeout=5)
        item_soup = BeautifulSoup(item_re.content, "html5lib")
        title = item_soup.find('h1', class_='title-article').string
        print('我已经来到-%s' % title)
        success_num += 1
    for item in list_li2:
        url = item.find('h4').find('a').attrs['href']
        item_re = requests.get(url, timeout=5)
        item_soup = BeautifulSoup(item_re.content, "html5lib")
        title = item_soup.find('h1', class_='title-article').string
        print('我已经来到-%s' % title)
        success_num += 1
    for item in list_li3:
        url = item.find('h4').find('a').attrs['href']
        item_re = requests.get(url, timeout=5)
        item_soup = BeautifulSoup(item_re.content, "html5lib")
        title = item_soup.find('h1', class_='title-article').string
        print('我已经来到-%s' % title)
        success_num += 1
    result = requests.get(strat_url, timeout=5)
    result_soup = BeautifulSoup(result.content, "html5lib")
    end_views = result_soup.select("div.grade-box dl:nth-of-type(2) dd")[0]['title']
    print('---------------------------------------')
    print('文章总数目：%s' % (len(list_li1) + len(list_li2) + len(list_li3)))
    print('成功访问量：%s' % success_num)
    print('失败访问量：%s' % err_num)
    print('当前访问量：%s' % end_views)
    print('本次访问量增加了：%d' % (int(end_views.replace(',', '')) - int(start_views.replace(',', ''))))
    print('---------------------------------------')
    print('end')
    # print(start_views.string.replace(',', ''))

print('开始启动爬虫-csdn')
start()
